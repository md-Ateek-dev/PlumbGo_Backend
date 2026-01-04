const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const {
  createBlog,
  getAdminBlogs,
  getPublishedBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  uploadBlogImage,
} = require("../Controllers/Blogs_Controller");
// console.log({
//   createBlog,
//   getAdminBlogs,
//   getPublishedBlogs,
// });

const { protect } = require("../Middlewares/User_Middleware");
const { admin } = require("../Middlewares/Admin_Middleware");


// /* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads", "blogs"));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
// 🔓 USER ROUTES
router.get("/Blogs", getPublishedBlogs);          // all published blogs
router.get("/Blogs/:slug", getBlogBySlug);        // single blog by slug

// 🔐 ADMIN ROUTES
router.post("/admin/blogs/upload-image", protect, admin, upload.single("image"), uploadBlogImage);
router.get("/admin/Blogs", protect, admin, getAdminBlogs);
router.post("/admin/Blogs", protect, admin, createBlog);
router.put("/admin/Blogs/:id", protect, admin, updateBlog);
router.delete("/admin/Blogs/:id", protect, admin, deleteBlog);

/* ✅ IMAGE UPLOAD */
router.post(
  "/admin/Blogs/upload-image",
  protect,
  admin,
  upload.single("image"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/blogs/${req.file.filename}`;

    res.json({
      success: true,
      imageUrl,
    });
  }
);

module.exports = router;
