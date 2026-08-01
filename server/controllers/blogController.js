const asyncHandler = require('../middleware/asyncHandler');
const Blog = require('../models/blog_model');
const createReactionHandlers = require('../utils/reactionHandlers');

const { toggleLike, toggleDislike } = createReactionHandlers(Blog, 'Blog', 'blogs');

const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find().populate('author', 'name');
  res.status(200).json({ blogs });
});

const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id)
    .populate('author', 'name')
    .populate('destinations', 'name city country images avg_rating');
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }
  res.status(200).json({ blog });
});

const createBlog = asyncHandler(async (req, res) => {
  const { title, description, content, destinations, images } = req.body;

  if (!title || !description || !content) {
    return res.status(400).json({ message: 'title, description and content are required' });
  }

  const blog = await Blog.create({
    title,
    description,
    content,
    destinations,
    images,
    author: req.user._id,
  });

  req.user.blogs_created.push(blog._id);
  await req.user.save();

  res.status(201).json({ blog });
});

const editBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  if (req.user.role !== 'admin' && !blog.author.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to edit this blog' });
  }

  const { title, description, content, destinations, images } = req.body;
  Object.assign(blog, { title, description, content, destinations, images });
  await blog.save();

  res.status(200).json({ blog });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  if (req.user.role !== 'admin' && !blog.author.equals(req.user._id)) {
    return res.status(403).json({ message: 'Not authorized to delete this blog' });
  }

  await blog.deleteOne();
  req.user.blogs_created.pull(blog._id);
  await req.user.save();

  res.status(200).json({ message: 'Blog deleted' });
});

module.exports = {
  getBlogs,
  getBlog,
  createBlog,
  editBlog,
  deleteBlog,
  toggleLike,
  toggleDislike,
};
