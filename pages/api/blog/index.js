import connectDB from '../../../lib/db';
import Blog from '../../../models/Blog';

export default async function handler(req, res) {
  await connectDB();

  if (req.method === 'GET') {
    try {
      const { published } = req.query;
      const filter = {};
      if (published === 'true') filter.isPublished = true;
      const posts = await Blog.find(filter).sort({ createdAt: -1 });
      return res.status(200).json({ success: true, posts });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { title } = req.body;
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const post = await Blog.create({ ...req.body, slug });
      return res.status(201).json({ success: true, post });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to create post' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
