import connectDB from '../../../lib/db';
import Testimonial from '../../../models/Testimonial';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const { visible, type } = req.query;
      const filter = {};
      if (visible === 'true') filter.isVisible = true;
      if (type) filter.type = type;
      const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, testimonials });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch testimonials' });
    }
  }

  if (req.method === 'POST') {
    try {
      const testimonial = await Testimonial.create(req.body);
      return res.status(201).json({ success: true, testimonial });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create testimonial' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
