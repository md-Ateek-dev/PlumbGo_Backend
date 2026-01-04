const Carousel = require("../Models/Carousel_Model");

// PUBLIC – GET /Carousel  (sirf active slides)
const getActiveSlides = async (req, res) => {
  try {
    const slides = await Carousel.find({ isActive: true })
      .sort({ sortOrder: 1, createdAt: 1 });

    return res.json({ success: true, slides });
  } catch (error) {
    console.error("Get active carousel error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ADMIN – GET /admin/Carousel (all slides)
const getAllSlides = async (req, res) => {
  try {
    const slides = await Carousel.find().sort({
      sortOrder: 1,
      createdAt: 1,
    });

    return res.json({ success: true, slides });
  } catch (error) {
    console.error("Get all carousel error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ADMIN – POST /admin/Carousel
const createSlide = async (req, res) => {
  try {
    const { title, imageUrl } = req.body;
    if (!title || !imageUrl) {
      return res
        .status(400)
        .json({ message: "Title and image Url are required" });
    }

    const slide = await Carousel.create(req.body);

    return res.status(201).json({
      success: true,
      slide,
    });
  } catch (error) {
    console.error("Create carousel error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ADMIN – PUT /admin/Carousel/:id
const updateSlide = async (req, res) => {
  try {
    const { id } = req.params;

    const slide = await Carousel.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!slide) {
      return res.status(404).json({ message: "Slide not found" });
    }

    return res.json({ success: true, slide });
  } catch (error) {
    console.error("Update carousel error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ADMIN – DELETE /admin/Carousel/:id
const deleteSlide = async (req, res) => {
  try {
    const { id } = req.params;

    await Carousel.findByIdAndDelete(id);

    return res.json({ success: true, message: "Slide deleted" });
  } catch (error) {
    console.error("Delete carousel error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getActiveSlides,
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
};
