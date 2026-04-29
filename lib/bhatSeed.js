// =====================================================
// BHAT OVERSEAS — One-time database seeding
// Triggered manually via /api/bhat/seed (super-admin only) or auto-runs
// on first login if no users exist.
// =====================================================

import bcrypt from 'bcryptjs';
import BhatUser from '../models/BhatUser';
import BhatClient from '../models/BhatClient';
import BhatTimeline from '../models/BhatTimeline';
import { PIPELINE_STAGES } from './bhatConstants';

const SEED_USERS = [
  // Super-admin without country sees both
  { name: 'Bikash Bhat',   email: 'bikash@bhatoverseas.com',     role: 'super_admin', country: null },
  // Turkey
  { name: 'Bikash (TR)',   email: 'bikash.tr@bhatoverseas.com',  role: 'super_admin', country: 'TR' },
  { name: 'Anita Sharma',  email: 'anita.tr@bhatoverseas.com',   role: 'admin',       country: 'TR' },
  { name: 'Ravi Pandey',   email: 'ravi.tr@bhatoverseas.com',    role: 'sub_admin',   country: 'TR' },
  // Romania
  { name: 'Bikash (RO)',   email: 'bikash.ro@bhatoverseas.com',  role: 'super_admin', country: 'RO' },
  { name: 'Maria Popescu', email: 'anita.ro@bhatoverseas.com',   role: 'admin',       country: 'RO' },
  { name: 'Vlad Ionescu',  email: 'ravi.ro@bhatoverseas.com',    role: 'sub_admin',   country: 'RO' },
];

const TR_NAMES = ['Bikram Thapa', 'Sita Rai', 'Kishor Lama', 'Rajesh Magar',
                  'Manish KC', 'Hari Shrestha', 'Nabin Tamang', 'Sunita Karki',
                  'Bishnu Subedi', 'Pradeep Khadka', 'Krishna Pandey', 'Rabi Bhandari'];

const RO_NAMES = ['Dipesh Magar', 'Anita Tamang', 'Sandeep KC', 'Kamal Shrestha',
                  'Rina Subedi', 'Pradip Lama', 'Govind Karki', 'Binod Rai'];

const TR_AGENTS  = ['Ramesh Kumar', 'Suresh Mehra', 'Anil Pradhan', 'Manoj Rai'];
const TR_COMPANIES = ['Anatolia Construction Ltd.', 'Bosphorus Industries',
                      'Istanbul Heavy Works', 'Marmara Logistics'];

const RO_AGENTS  = ['Ramesh Kumar', 'Anil Pradhan', 'Deepak Khanal'];
const RO_COMPANIES = ['Bucharest Build SRL', 'Cluj Manufacturing',
                      'Timisoara Logistics', 'Dacia Industrial'];

const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const pad  = n => String(n).padStart(3, '0');

export async function seedBhatIfEmpty() {
  const userCount = await BhatUser.countDocuments();
  if (userCount === 0) {
    const hashedPwd = await bcrypt.hash('ChangeMe123!', 10);
    for (const u of SEED_USERS) {
      await BhatUser.create({ ...u, password: hashedPwd });
    }
  }

  const clientCount = await BhatClient.countDocuments();
  if (clientCount === 0) {
    let n = 1;
    // Turkey clients
    for (let i = 0; i < TR_NAMES.length; i++, n++) {
      const stageIdx = i % PIPELINE_STAGES.length;
      const c = await BhatClient.create({
        refNo:    `BHAT-REF-${pad(n)}`,
        fullName: TR_NAMES[i],
        country:  'TR',
        company:  pick(TR_COMPANIES),
        agentName:pick(TR_AGENTS),
        position: 'Welder',
        stage:    PIPELINE_STAGES[stageIdx].key,
        progress: stageIdx + 1,
        isUrgent: Math.random() < 0.15,
        stageEnteredAt: new Date(Date.now() - Math.random() * 20 * 86400000),
      });
      await BhatTimeline.create({
        client: c._id, isSystem: true,
        eventType: 'created', description: `Client ${c.fullName} created (seed)`,
      });
    }
    // Romania clients
    for (let i = 0; i < RO_NAMES.length; i++, n++) {
      const stageIdx = i % PIPELINE_STAGES.length;
      const c = await BhatClient.create({
        refNo:    `BHAT-REF-${pad(n)}`,
        fullName: RO_NAMES[i],
        country:  'RO',
        company:  pick(RO_COMPANIES),
        agentName:pick(RO_AGENTS),
        position: 'Construction Worker',
        stage:    PIPELINE_STAGES[stageIdx].key,
        progress: stageIdx + 1,
        isUrgent: Math.random() < 0.15,
        stageEnteredAt: new Date(Date.now() - Math.random() * 20 * 86400000),
      });
      await BhatTimeline.create({
        client: c._id, isSystem: true,
        eventType: 'created', description: `Client ${c.fullName} created (seed)`,
      });
    }

    // Assign a few clients to each country's sub-admin
    for (const code of ['TR', 'RO']) {
      const sub = await BhatUser.findOne({ role: 'sub_admin', country: code });
      if (sub) {
        const clients = await BhatClient.find({ country: code }).limit(3);
        sub.assignedClients = clients.map(c => c._id);
        await sub.save();
      }
    }
  }

  return {
    users:   await BhatUser.countDocuments(),
    clients: await BhatClient.countDocuments(),
  };
}
