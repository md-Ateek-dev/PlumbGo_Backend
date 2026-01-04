const Gallery = require("../Models/Gallery_Model");

// ADMIN: upload image
const uploadGalleryImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Image required" });
  }

  res.json({
    success: true,
    imageUrl: `/uploads/gallery/${req.file.filename}`,
  });
};

// ADMIN: create gallery item
const createGallery = async (req, res) => {
  const gallery = await Gallery.create(req.body);
  res.status(201).json({ success: true, gallery });
};
// exports.getAdminGallery = async (req, res) => {
//   const items = await Gallery.find().sort("-createdAt");
//   res.json({ success: true, gallery: items }); // 👈 gallery key
// };

// ADMIN: list
const getAdminGallery = async (req, res) => {
  const items = await Gallery.find().sort("-createdAt");
  res.json({ success: true, images: items });
};

// ADMIN: update
const updateGallery = async (req, res) => {
  try {
    const updated = await Gallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Image not found" });
    }

    res.json({ success: true, image: updated });
    console.log("UPDATE ID:", req.params.id);
  } catch (err) {
    console.error("Update gallery error:", err);
    res.status(500).json({ message: "Update failed" });
  }
};
// console.log("UPDATE ID:", req.params.id);
// console.log("UPDATE BODY:", req.body);

// ADMIN: delete
const deleteGallery = async (req, res) => {
  await Gallery.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

// USER: active gallery (pagination)
const getGallery = async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const skip = Number(req.query.skip) || 0;

  const items = await Gallery.find({ isActive: true })
    .sort("-createdAt")
    .skip(skip)
    .limit(limit);

  const total = await Gallery.countDocuments({ isActive: true });

  res.json({ success: true, items, total });
};

module.exports = {
    createGallery,
    getAdminGallery,
    uploadGalleryImage,
    getGallery,
    updateGallery,
    deleteGallery,
    
}