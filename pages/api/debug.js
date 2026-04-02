import connectDB from '../../lib/db';
import mongoose from 'mongoose';
const JobSchema = new mongoose.Schema({ title: String, industry: String, location: String, positions: Number, duration: String, accommodation: Boolean, salary: String, status: String, createdAt: Date });
const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);
export default async function handler(req, res) {
  await connectDB();
  const jobs = [
    {title:'Licensed Welders',industry:'Construction',location:'București',positions:15,salary:'€530-700/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Masons & Bricklayers',industry:'Construction',location:'București & Cluj-Napoca',positions:25,salary:'€530-600/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Electricians',industry:'Construction',location:'Timișoara',positions:10,salary:'€530-650/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Crane Operators',industry:'Construction',location:'București',positions:5,salary:'€560-800/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Carpenters & Formwork',industry:'Construction',location:'Brașov',positions:20,salary:'€530-600/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Plumbers & Pipe Fitters',industry:'Construction',location:'București',positions:8,salary:'€530-650/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Painters & Finishers',industry:'Construction',location:'Cluj-Napoca & Brașov',positions:12,salary:'€530-560/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'General Laborers',industry:'Construction',location:'Various',positions:30,salary:'€530/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'CNC Machine Operators',industry:'Manufacturing',location:'Cluj-Napoca',positions:12,salary:'€530-650/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Assembly Line Workers',industry:'Manufacturing',location:'Sibiu',positions:30,salary:'€530-550/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Factory Machine Operators',industry:'Manufacturing',location:'Oradea',positions:20,salary:'€530-560/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Quality Control Inspectors',industry:'Manufacturing',location:'Timișoara',positions:8,salary:'€530-600/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Textile & Garment Workers',industry:'Manufacturing',location:'Iași',positions:15,salary:'€530/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Cooks & Sous Chefs',industry:'Hospitality',location:'Constanța & București',positions:15,salary:'€530-650/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Hotel Housekeeping',industry:'Hospitality',location:'Constanța & Brașov',positions:20,salary:'€530/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Waiters & Restaurant Staff',industry:'Hospitality',location:'București',positions:10,salary:'€530-560/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Kitchen Helpers',industry:'Hospitality',location:'Various',positions:15,salary:'€530/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Hotel Reception',industry:'Hospitality',location:'București & Brașov',positions:5,salary:'€530-600/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Warehouse Operatives',industry:'Logistics',location:'București & Timișoara',positions:25,salary:'€530-550/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Forklift Operators',industry:'Logistics',location:'Cluj-Napoca',positions:8,salary:'€530-600/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Professional Drivers C+E',industry:'Logistics',location:'Various',positions:10,salary:'€560-800/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Package Sorters',industry:'Logistics',location:'București',positions:20,salary:'€530/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Agricultural Workers',industry:'Agriculture',location:'Various',positions:30,salary:'€530/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Livestock & Farm Workers',industry:'Agriculture',location:'Rural Romania',positions:10,salary:'€530-550/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Food Processing Workers',industry:'Agriculture',location:'Iași & Galați',positions:15,salary:'€530-550/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Greenhouse Workers',industry:'Agriculture',location:'Southern Romania',positions:12,salary:'€530/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Industrial Cleaners',industry:'Facility Services',location:'București',positions:15,salary:'€530/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Building Maintenance',industry:'Facility Services',location:'București & Cluj-Napoca',positions:8,salary:'€530-550/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Care Assistants',industry:'Healthcare',location:'București & Timișoara',positions:10,salary:'€530-600/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
    {title:'Hospital Support Staff',industry:'Healthcare',location:'Cluj-Napoca',positions:8,salary:'€530-550/mo net + accom + €100 food',duration:'1 Year Contract + Work Permit',accommodation:true,status:'active',createdAt:new Date()},
  ];
  const result = await Job.insertMany(jobs);
  const count = await Job.countDocuments();
  res.json({ inserted: result.length, totalNow: count });
}
