// =====================================================
// POST /api/bhat/documents/upload
// Body: { clientId, docType, dataUri, runOcr?: boolean }
//   dataUri must be a base64 string like "data:image/jpeg;base64,..."
// Behaviour:
//   1. Upload to Cloudinary at folder bhat-overseas/{country}/{company}/{candidate}/{docType}_{ts}
//   2. Run OCR if requested (or auto for passport / police_report)
//   3. Insert BhatDocument with file URL + OCR-extracted dates
//   4. Auto-fill BhatCV fields (full name, passport no, father, mother, etc.)
//   5. Auto-advance pipeline stage if doc triggers a transition
// =====================================================
import connectDB from '../../../../lib/db';
import BhatClient from '../../../../models/BhatClient';
import BhatDocument from '../../../../models/BhatDocument';
import BhatCV from '../../../../models/BhatCV';
import BhatTimeline from '../../../../models/BhatTimeline';
import BhatUser from '../../../../models/BhatUser';
import { requireApiUser } from '../../../../lib/bhatAuth';
import { uploadDocument } from '../../../../lib/bhatCloudinary';
import { extractFromDocument } from '../../../../lib/bhatOcr';
import { DOC_STAGE_TRIGGERS, STAGE_BY_KEY, PIPELINE_STAGES } from '../../../../lib/bhatConstants';

// Increase request body limit so big base64 images go through
export const config = {
  api: {
    bodyParser: { sizeLimit: '12mb' },
  },
};

const OCR_DOC_TYPES = new Set(['passport', 'police_report', 'electricity_bill', 'water_bill', 'bill', 'cv']);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const user = requireApiUser(req, res);
  if (!user) return;

  const { clientId, docType, dataUri, runOcr } = req.body || {};
  if (!clientId)  return res.status(400).json({ error: 'clientId required' });
  if (!docType)   return res.status(400).json({ error: 'docType required' });
  if (!dataUri)   return res.status(400).json({ error: 'dataUri required' });
  if (!/^data:[\w/+\-.]+;base64,/.test(dataUri)) {
    return res.status(400).json({ error: 'dataUri must be a base64 data URI' });
  }

  await connectDB();
  const client = await BhatClient.findById(clientId);
  if (!client) return res.status(404).json({ error: 'Client not found' });

  // Sub-admin: must be assigned
  if (user.role === 'sub_admin') {
    const me = await BhatUser.findById(user.id).lean();
    const ok = (me?.assignedClients || []).map(x => x.toString()).includes(clientId);
    if (!ok) return res.status(403).json({ error: 'Not assigned to this client' });
  }

  // 1) Upload to Cloudinary — folder = bhat-overseas/{company}/{name}_{refNo}/{docType}
  const upload = await uploadDocument({
    dataUri,
    company:   client.company || 'unassigned',
    candidate: client.fullName,
    refNo:     client.refNo,
    docType,
  });

  // 2) Run OCR if applicable (Gemini-cleaned if GEMINI_API_KEY set)
  let ocr = null;
  if (runOcr || OCR_DOC_TYPES.has(docType)) {
    try { ocr = await extractFromDocument({ dataUri, docType }); }
    catch (e) { console.error('OCR error:', e?.message); }
  }

  // 3) Compute review flag from confidence
  const confidence  = ocr?._meta?.confidence ?? null;
  const needsReview = confidence !== null && confidence < 85;
  const docStatus   = needsReview ? 'needs_review' : 'ok';

  // Auto-flag passports near expiry as 'expiring'
  const expiry = ocr?.expiry_date ? new Date(ocr.expiry_date) : null;
  const issue  = ocr?.issue_date  ? new Date(ocr.issue_date)  : null;
  let status = docStatus;
  if (expiry && expiry < new Date(Date.now() + 6 * 30 * 86400000) && status === 'ok') {
    status = 'expiring';
  }

  const doc = await BhatDocument.create({
    client:        client._id,
    docType,
    fileUrl:       upload.url,
    filePublicId:  upload.public_id,
    folder:        upload.folder,
    issueDate:     issue,
    expiryDate:    expiry,
    status,
    needsReview,
    ocrConfidence: confidence,
    ocrRawText:    ocr?._meta?.raw_text_preview || null,
    ocrExtracted:  ocr ? {
      full_name:   ocr.full_name,
      passport_no: ocr.passport_no,
      dob:         ocr.dob,
      gender:      ocr.gender,
      issue_date:  ocr.issue_date,
      expiry_date: ocr.expiry_date,
      father_name: ocr.father_name,
      mother_name: ocr.mother_name,
      address:     ocr.address,
      nationality: ocr.nationality,
      source:      ocr._meta?.source,
    } : null,
    uploadedBy:    user.id,
  });

  // 4a) If we extracted a passport number, sync it onto the client itself
  //      so finance / search can find the candidate by passport.
  if (ocr?.passport_no && docType === 'passport' && !client.passportNo) {
    client.passportNo = ocr.passport_no;
    await client.save();
  }

  // 4) Auto-fill CV record
  if (ocr && (docType === 'passport' || docType === 'cv')) {
    const cv = (await BhatCV.findOne({ client: client._id })) || new BhatCV({ client: client._id });
    cv.autoFullName       ||= ocr.full_name || null;
    cv.autoPassportNo     ||= ocr.passport_no || null;
    cv.autoDob            ||= ocr.dob ? new Date(ocr.dob) : null;
    cv.autoGender         ||= ocr.gender || null;
    cv.autoPassportIssue  ||= issue;
    cv.autoPassportExpiry ||= expiry;
    cv.autoFatherName     ||= ocr.father_name || null;
    cv.autoMotherName     ||= ocr.mother_name || null;
    cv.autoNationality    ||= ocr.nationality || null;
    cv.autoAddress        ||= ocr.address || null;
    await cv.save();
  } else if (ocr && (docType === 'electricity_bill' || docType === 'water_bill' || docType === 'bill')) {
    const cv = (await BhatCV.findOne({ client: client._id })) || new BhatCV({ client: client._id });
    cv.autoAddress ||= ocr.address || null;
    await cv.save();
  }

  // 5) Auto-advance pipeline stage if eligible
  const targetStageKey = DOC_STAGE_TRIGGERS[docType];
  if (targetStageKey) {
    const currentIdx = STAGE_BY_KEY[client.stage]?.index ?? 0;
    const targetIdx  = STAGE_BY_KEY[targetStageKey]?.index ?? currentIdx;
    if (targetIdx > currentIdx) {
      const oldKey = client.stage;
      client.stage          = targetStageKey;
      client.progress       = targetIdx + 1;
      client.stageEnteredAt = new Date();
      await client.save();
      await BhatTimeline.create({
        client: client._id, isSystem: true,
        eventType: 'stage_advanced_auto',
        description: `Auto-advanced ${STAGE_BY_KEY[oldKey].label} → ${STAGE_BY_KEY[targetStageKey].label} after ${docType} upload`,
      });
    }
  }

  // Always log the upload
  await BhatTimeline.create({
    client: client._id, actor: user.id, actorName: user.name, isSystem: false,
    eventType: 'document_uploaded',
    description: `${docType.replace(/_/g,' ')} uploaded by ${user.name}`,
  });

  return res.status(200).json({
    ok: true,
    documentId: doc._id.toString(),
    fileUrl:    doc.fileUrl,
    folder:     upload.folder,
    ocr:        ocr || null,
  });
}
