import connectDB from '../../lib/db';
import mongoose from 'mongoose';
const JobSchema = new mongoose.Schema({ title: String, industry: String, location: String, positions: Number, duration: String, accommodation: Boolean, salary: String, status: { type: String, default: 'active' }, createdAt: { type: Date, default: Date.now } });
const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);
export default async function handler(req, res) {
  await connectDB();
  const j = [
    { title:'Licensed Welders',industry:'Construction',location:'București',positions:15,salary:'€530-700/month net + accommodation + €100 food' },
    { title:'Masons & Bricklayers',industry:'Construction',location:'București & Cluj-Napoca',positions:25,salary:'€530-600/month net + accommodation + €100 food' },
    { title:'Electricians',industry:'Construction',location:'Timișoara',positions:10,salary:'€530-650/month net + accommodation + €100 food' },
    { title:'Crane Operators',industry:'Construction',location:'București',positions:5,salary:'€560-800/month net + accommodation + €100 food' },
    { title:'Carpenters & Formwork',industry:'Construction',location:'Brașov',positions:20,salary:'€530-600/month net + accommodation + €100 food' },
    { title:'Plumbers & Pipe Fitters',industry:'Construction',location:'București',positions:8,salary:'€530-650/month net + accommodation + €100 food' },
    { title:'Painters & Finishers',industry:'Construction',location:'Cluj-Napoca & Brașov',positions:12,salary:'€530-560/month net + accommodation + €100 food' },
    { title:'General Laborers',industry:'Construction',location:'Various',positions:30,salary:'€530/month net + accommodation + €100 food' },
    { title:'CNC Machine Operators',industry:'Manufacturing',location:'Cluj-Napoca',positions:12,salary:'€530-650/month net + accommodation + €100 food' },
    { title:'Assembly Line Workers',industry:'Manufacturing',location:'Sibiu',positions:30,salary:'€530-550/month net + accommodation + €100 food' },
    { title:'Factory Machine Operators',industry:'Manufacturing',location:'Oradea',positions:20,salary:'€530-560/month net + accommodation + €100 food' },
    { title:'Quality Control Inspectors',industry:'Manufacturing',location:'Timișoara',positions:8,salary:'€530-600/month net + accommodation + €100 food' },
    { title:'Textile & Garment Workers',industry:'Manufacturing',location:'Iași',positions:15,salary:'€530/month net + accommodation + €100 food' },
    { title:'Cooks & Sous Chefs',industry:'Hospitality',location:'Constanța & București',positions:15,salary:'€530-650/month net + accommodation + €100 food' },
    { title:'Hotel Housekeeping',industry:'Hospitality',location:'Constanța & Brașov',positions:20,salary:'€530/month net + accommodation + €100 food' },
    { title:'Waiters & Restaurant Staff',industry:'Hospitality',location:'București',positions:10,salary:'€530-560/month net + accommodation + €100 food' },
    { title:'Kitchen Helpers',industry:'Hospitality',location:'Various',positions:15,salary:'€530/month net + accommodation + €100 food' },
    { title:'Hotel Reception',industry:'Hospitality',location:'București & Brașov',positions:5,salary:'€530-600/month net + accommodation + €100 food' },
    { title:'Warehouse Operatives',industry:'Logistics',location:'București & Timișoara',positions:25,salary:'€530-550/month net + accommodation + €100 food' },
    { title:'Forklift Operators',industry:'Logistics',location:'Cluj-Napoca',positions:8,salary:'€530-600/month net + accommodation + €100 food' },
    { title:'Professional Drivers C+E',industry:'Logistics',location:'Various',positions:10,salary:'€560-800/month net + accommodation + €100 food' },
    { title:'Package Sorters & Loaders',industry:'Logistics',location:'București',positions:20,salary:'€530/month net + accommodation + €100 food' },
    { title:'Agricultural Workers',industry:'Agriculture',location:'Various',positions:30,salary:'€530/month net + accommodation + €100 food' },
    { title:'Livestock & Farm Workers',industry:'Agriculture',location:'Rural Romania',positions:10,salary:'€530-550/month net + accommodation + €100 food' },
    { title:'Food Processing Workers',industry:'Agriculture',location:'Iași & Galați',positions:15,salary:'€530-550/month net + accommodation + €100 food' },
    { title:'Greenhouse Workers',industry:'Agriculture',location:'Southern Romania',positions:12,salary:'€530/month net + accommodation + €100 food' },
    { title:'Industrial Cleaners',industry:'Facility Services',location:'București',positions:15,salary:'€530/month net + accommodation + €100 food' },
    { title:'Building Maintenance',industry:'Facility Services',location:'București & Cluj-Napoca',positions:8,salary:'€530-550/month net + accommodation + €100 food' },
    { title:'Care Assistants',industry:'Healthcare',location:'București & Timișoara',positions:10,salary:'€530-600/month net + accommodation + €100 food' },
    { title:'Hospital Support Staff',industry:'Healthcare',location:'Cluj-Napoca',positions:8,salary:'€530-550/month net + accommodation + €100 food' },
  ].map(x=>({...x,duration:'1 Year Contract + Work Permit',accommodation:true}));
  await Job.deleteMany({});
  const result = await Job.insertMany(j);
  res.json({ success:true, count:result.length });
}
