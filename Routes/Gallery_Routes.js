// const express = require("express");
// const router = express.Router();
// const path = require("path");
// const multer = require("multer");

// const { admin } = require("../Middlewares/Admin_Middleware");
// const ctrl = require("../Controllers/Gallery_Controller");

// // storage
// const storage = multer.diskStorage({
//   destination: "uploads/gallery",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith("image/")) cb(null, true);
//     else cb(new Error("Only images allowed"));
//   },
// });

// // ADMIN
// router.post("/admin/gallery/upload", admin, upload.single("image"), ctrl.uploadGalleryImage);
// router.post("/admin/gallery", admin, ctrl.createGallery);
// router.get("/admin/gallery", admin, ctrl.getAdminGallery);
// router.delete("/admin/gallery/:id", admin, ctrl.deleteGallery);

// // USER
// router.get("/gallery", ctrl.getGallery);

// module.exports = router;
const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");

const { protect } = require("../Middlewares/User_Middleware"); // ✅ ADD THIS
const { admin } = require("../Middlewares/Admin_Middleware");
const ctrl = require("../Controllers/Gallery_Controller");

// storage
const storage = multer.diskStorage({
  destination: "uploads/gallery",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images allowed"));
  },
});

// ================= ADMIN ROUTES =================
router.post(
  "/admin/gallery/upload",
  protect,   // ✅ FIRST
  admin,     // ✅ SECOND
  upload.single("image"),
  ctrl.uploadGalleryImage
);

router.post(
  "/admin/gallery",
  protect,
  admin,
  ctrl.createGallery
);

router.get(
  "/admin/gallery",
  protect,
  admin,
  ctrl.getAdminGallery
);
router.put("/admin/gallery/:id",protect, admin, ctrl.updateGallery);   // 👈 UPDATE

router.delete(
  "/admin/gallery/:id",
  protect,
  admin,
  ctrl.deleteGallery
);

// ================= USER ROUTE =================
router.get("/gallery", ctrl.getGallery);

module.exports = router;
