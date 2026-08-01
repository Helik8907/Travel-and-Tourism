const express = require('express');
const {
  getBlogs,
  getBlog,
  createBlog,
  editBlog,
  deleteBlog,
  toggleLike,
  toggleDislike,
} = require('../controllers/blogController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', getBlogs);
router.get('/:id', getBlog);
router.post('/', protect, createBlog);
router.put('/:id', protect, editBlog);
router.delete('/:id', protect, deleteBlog);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/dislike', protect, toggleDislike);

module.exports = router;
