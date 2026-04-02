import connectDB from '../../lib/db';
import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({ title: String, industry: String, location: String, positions: Number, duration: String, accommodation: Boolean, salary: String, status: { type: String, default: 'active' }, createdAt: { type: Date, default: Date.now } });
const Job = mongoose.models.Job || mongoose.model('Job', JobSchema);

export default async function handler(req, res) {
  await connectDB();
  const jobs = [
    { title: 'Licensed Welders (MIG/MAG/TIG)', industry: 'Construction', location: 'București', positions: 15, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530–700/month net + accommodation + €100 food' },
    { title: 'Masons & Bricklayers', industry: 'Construction', location: 'București & Cluj-Napoca', positions: 25, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530–600/month net + accommodation + €100 food' },
    { title: 'Electricians', industry: 'Construction', location: 'Timișoara', positions: 10, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530–650/month net + accommodation + €100 food' },
    { title: 'Crane Operators', industry: 'Construction', location: 'București', positions: 5, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€560–800/month net + accommodation + €100 food' },
    { title: 'Carpenters & Formwork Workers', industry: 'Construction', location: 'Brașov', positions: 20, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530–600/month net + accommodation + €100 food' },
    { title: 'Plumbers & Pipe Fitters', industry: 'Construction', location: 'București', positions: 8, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530–650/month net + accommodation + €100 food' },
    { title: 'Painters & Finishers', industry: 'Construction', location: 'Cluj-Napoca & Brașov', positions: 12, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530–560/month net + accommodation + €100 food' },
    { title: 'General Construction Laborers', industry: 'Construction', location: 'Various Locations', positions: 30, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530/month net + accommodation + €100 food' },
    { title: 'CNC Machine Operators', industry: 'Manufacturing', location: 'Cluj-Napoca', positions: 12, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530–650/month net + accommodation + €100 food' },
    { title: 'Assembly Line Workers', industry: 'Manufacturing', location: 'Sibiu', positions: 30, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530–550/month net + accommodation + €100 food' },
    { title: 'Factory Machine Operators', industry: 'Manufacturing', location: 'Oradea', positions: 20, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530–560/month net + accommodation + €100 food' },
    { title: 'Quality Control Inspectors', industry: 'Manufacturing', location: 'Timișoara', positions: 8, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530–600/month net + accommodation + €100 food' },
    { title: 'Textile & Garment Workers', industry: 'Manufacturing', location: 'Iași', positions: 15, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530/month net + accommodation + €100 food' },
    { title: 'Cooks & Sous Chefs', industry: 'Hospitality', location: 'Constanța & București', positions: 15, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530–650/month net + accommodation + €100 food' },
    { title: 'Hotel Housekeeping Staff', industry: 'Hospitality', location: 'Constanța & Brașov', positions: 20, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530/month net + accommodation + €100 food' },
    { title: 'Waiters & Restaurant Staff', industry: 'Hospitality', location: 'București', positions: 10, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530–560/month net + accommodation + €100 food' },
    { title: 'Kitchen Helpers & Dishwashers', industry: 'Hospitality', location: 'Various Locations', positions: 15, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530/month net + accommodation + €100 food' },
    { title: 'Hotel Reception & Front Desk', industry: 'Hospitality', location: 'București & Brașov', positions: 5, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530–600/month net + accommodation + €100 food' },
    { title: 'Warehouse Operatives', industry: 'Logistics', location: 'București & Timișoara', positions: 25, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530–550/month net + accommodation + €100 food' },
    { title: 'Forklift Operators', industry: 'Logistics', location: 'Cluj-Napoca', positions: 8, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530–600/month net + accommodation + €100 food' },
    { title: 'Professional Drivers (C+E)', industry: 'Logistics', location: 'Various Locations', positions: 10, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€560–800/month net + accommodation + €100 food' },
    { title: 'Package Sorters & Loaders', industry: 'Logistics', location: 'București', positions: 20, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530/month net + accommodation + €100 food' },
    { title: 'Agricultural Workers', industry: 'Agriculture', location: 'Various Locations', positions: 30, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530/month net + accommodation + €100 food' },
    { title: 'Livestock & Farm Workers', industry: 'Agriculture', location: 'Rural Romania', positions: 10, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530–550/month net + accommodation + €100 food' },
    { title: 'Food Processing Workers', industry: 'Agriculture', location: 'Iași & Galați', positions: 15, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530–550/month net + accommodation + €100 food' },
    { title: 'Greenhouse Workers', industry: 'Agriculture', location: 'Southern Romania', positions: 12, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530/month net + accommodation + €100 food' },
    { title: 'Industrial Cleaners', industry: 'Facility Services', location: 'București', positions: 15, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530/month net + accommodation + €100 food' },
    { title: 'Building Maintenance Workers', industry: 'Facility Services', location: 'București & Cluj-Napoca', positions: 8, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530–550/month net + accommodation + €100 food' },
    { title: 'Care Assistants', industry: 'Healthcare', location: 'București & Timișoara', positions: 10, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530–600/month net + accommodation + €100 food' },
    { title: 'Hospital Support Staff', industry: 'Healthcare', location: 'Cluj-Napoca', positions: 8, duration: '1 Year Contract + Work Permit', accommodation: true, salary: '€530–550/month net + accommodation + €100 food' },
  ];
  await Job.deleteMany({});
  await Job.insertMany(jobs);
  res.json({ success: true, count: jobs.length });
}
