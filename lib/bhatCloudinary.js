// =====================================================
// BHAT OVERSEAS — Cloudinary upload helper
// Uploads files to a structured folder:
//   bhat-overseas/{country}/{company}/{candidate}/{docType}_{ts}.{ext}
// Cloudinary auto-creates folders that don't exist.
//
// Required env vars (add on Vercel):
//   CLOUDINARY_CLOUD_NAME
//   CLOUDINARY_API_KEY
//   CLOUDINARY_API_SECRET
// =====================================================

import { v2 as cloudinary } from 'cloudinary';

let configured = false;
function ensureConfig() {
  if (configured) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure:     true,
  });
  configured = true;
}

// Sanitize a path segment (strip slashes/special chars so folder names are clean)
function slug(s) {
  return (s || 'unknown').toString()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '_')
    .toLowerCase()
    .slice(0, 60);
}

/**
 * Upload a base64 string or buffer to Cloudinary.
 * Folder structure (per spec):
 *   bhat-overseas/{Company_Name}/{Candidate_Name}_{RefNo}/{Document_Type}/
 *
 * @param {Object} opts
 * @param {string} opts.dataUri      e.g. "data:image/jpeg;base64,/9j/..."
 * @param {string} opts.company      candidate's destination company
 * @param {string} opts.candidate    candidate full name
 * @param {string} opts.refNo        candidate ref no (e.g. BHAT-REF-001)
 * @param {string} opts.docType      "passport" | "police_report" | etc.
 * @returns {Promise<{ url: string, public_id: string, folder: string }>}
 */
export async function uploadDocument({ dataUri, company, candidate, refNo, docType }) {
  ensureConfig();

  const companySlug   = slug(company || 'unassigned');
  const candidateSlug = `${slug(candidate)}_${slug(refNo || 'no-ref')}`.replace(/_+$/,'');
  const docSlug       = slug(docType || 'misc');
  const folder        = `bhat-overseas/${companySlug}/${candidateSlug}/${docSlug}`;

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    // Dev fallback when Cloudinary isn't configured — return a fake URL
    return {
      url: `https://placeholder.invalid/${docType}-${Date.now()}.jpg`,
      public_id: `mock_${docType}_${Date.now()}`,
      folder,
      _mock: true,
    };
  }

  const ts = Date.now();
  const result = await cloudinary.uploader.upload(dataUri, {
    folder,                                  // Cloudinary creates path if missing
    public_id:    `${docSlug}_${ts}`,        // e.g. passport_1700000000
    resource_type: 'auto',                   // image | pdf | raw — auto-detect
    overwrite:    false,                     // never overwrite — versioning safe
    use_filename: false,
    unique_filename: true,
  });

  return {
    url:       result.secure_url,
    public_id: result.public_id,
    folder,
    bytes:     result.bytes,
    format:    result.format,
  };
}

/**
 * Permanently delete a Cloudinary asset by its public_id.
 * Used by the cron cleanup job and the manual delete flow.
 */
export async function deleteAsset(publicId, resourceType = 'image') {
  ensureConfig();
  if (!publicId || publicId.startsWith('mock_')) return { ok: true, _mock: true };
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true });
    return { ok: true };
  } catch (e) {
    console.error('Cloudinary delete failed:', publicId, e?.message);
    return { ok: false, error: e?.message };
  }
}
