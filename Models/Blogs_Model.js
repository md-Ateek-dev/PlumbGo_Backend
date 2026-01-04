const mongoose = require("mongoose");

const blogsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      required: true,
      maxlength: 300,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String, // image URL
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: String,
      default: "Admin",
    },
    linkedGalleryImages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gallery",
    },
  ],
  },
  
  { timestamps: true }
);

module.exports = mongoose.model("Blogs", blogsSchema);
