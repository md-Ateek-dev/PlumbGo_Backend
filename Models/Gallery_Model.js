const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    title: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    // 🔥 Blog auto-link
  blogSlug: {
    type: String,
  },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", gallerySchema);
