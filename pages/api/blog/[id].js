import connectDB from '../../../lib/db';
import Blog from '../../../models/Blog';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const post = await Blog.findById(id);
      if (!post) return res.status(404).json({ error: 'Post not found' });
      return res.status(200).json({ success: true, post });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch post' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const post = await Blog.findByIdAndUpdate(id, req.body, { new: true });
      if (!post) return res.status(404).json({ error: 'Post not found' });
      return res.status(200).json({ success: true, post });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update post' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      await Blog.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete post' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
