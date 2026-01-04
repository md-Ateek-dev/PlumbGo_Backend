const { get } = require("mongoose");
const Blog = require("../Models/Blogs_Model");
const slugify = require("slugify");

// ✅ Admin: create blog
const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, coverImage, isPublished } = req.body;

    const slug = slugify(title, { lower: true, strict: true });

    const blog = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      coverImage,
      isPublished,
    });

    res.status(201).json({ success: true, blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ✅ Admin: get all blogs
const getAdminBlogs = async (req, res) => {
  const blogs = await Blog.find().sort("-createdAt");
  res.json({ success: true, blogs });
};

// ✅ User: published blogs only
const getPublishedBlogs = async (req, res) => {
  const blogs = await Blog.find({ isPublished: true }).sort("-createdAt");
  res.json({ success: true, blogs });
};

// ✅ Blog details (user)
const getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({
    slug: req.params.slug,
    isPublished: true,
  });

  if (!blog) {
    return res.status(404).json({ message: "Blog not found" });
  }

  res.json({ success: true, blog });
};

// ✅ Admin: update blog
const updateBlog = async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json({ success: true, blog });
};

// ✅ Admin: delete blog
const deleteBlog = async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Blog deleted" });
};

const uploadBlogImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const imageUrl = `/uploads/blogs/${req.file.filename}`;

    res.json({
      success: true,
      imageUrl,
    });
  } catch (err) {
    res.status(500).json({ message: "Image upload failed" });
  }
};


module.exports = {
  createBlog,
  getPublishedBlogs,
  getBlogBySlug,
  getAdminBlogs,
  deleteBlog,
  updateBlog,
  uploadBlogImage,
}