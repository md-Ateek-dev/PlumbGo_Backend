const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const {
  getActiveSlides,
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
} = require("../Controllers/Carousel_Controller");

const { admin } = require("../Middlewares/Admin_Middleware");
const { protect } = require("../Middlewares/User_Middleware");

// ✅ Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads", "carousel"));
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  },
});
const upload = multer({ storage });

// PUBLIC – user frontend
router.get("/Carousel", getActiveSlides);

// ADMIN – protected
router.get("/admin/Carousel", protect, admin, getAllSlides);
router.post("/admin/Carousel", protect, admin, createSlide);
router.put("/admin/Carousel/:id", protect, admin, updateSlide);
router.delete("/admin/Carousel/:id", protect, admin, deleteSlide);


// ✅ Admin – image upload (multipart/form-data)
router.post(
  "/admin/Carousel/upload-image",
  protect,
  admin,
  upload.single("image"),
  (req, res) => {
    console.log("FILE:", req.file);
  console.log("BODY:", req.body);
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const relativePath = `/uploads/carousel/${req.file.filename}`;
    const fullUrl = `${req.protocol}://${req.get("host")}${relativePath}`;

    return res.json({
      success: true,
      imageUrl: fullUrl,
    });
  }
);


module.exports = router;
