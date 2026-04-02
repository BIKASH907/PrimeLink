const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb+srv://primelink:Z1RjGMWJNuAKndXO@cluster0.zbufj2k.mongodb.net/primelink').then(async () => {
  const AdminSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String, createdAt: { type: Date, default: Date.now } });
  const Admin = mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
  const hash = await bcrypt.hash('Primelink@2026', 10);
  await Admin.findOneAndUpdate({ email: 'admin@primelinkhumancapital.com' }, { name: 'Bikash', email: 'admin@primelinkhumancapital.com', password: hash, role: 'super_admin' }, { upsert: true });
  console.log('Admin created!');
  console.log('Email: admin@primelinkhumancapital.com');
  console.log('Password: Primelink@2026');
  process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });
