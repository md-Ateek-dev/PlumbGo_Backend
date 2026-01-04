const Testimonial = require("../Models/Testimonial_Model");

// 🔹 USER: submit review
exports.createTestimonial = async (req, res) => {
  try {
    const { name, rating, message, city } = req.body;

    if (!name || !rating || !message) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const testimonial = await Testimonial.create({
      name,
      rating,
      message,
      city,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted for approval",
      testimonial,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 ADMIN: get all reviews
exports.getAdminTestimonials = async (req, res) => {
  const testimonials = await Testimonial.find().sort("-createdAt");
  res.json({ success: true, testimonials });
};


// 🔹 ADMIN: approve / reject
exports.updateTestimonialStatus = async (req, res) => {
  const { isApproved } = req.body;

  const testimonial = await Testimonial.findByIdAndUpdate(
    req.params.id,
    { isApproved },
    { new: true }
  );

  res.json({ success: true, testimonial });
};

// 🔹 ADMIN: delete review
exports.deleteTestimonial = async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Testimonial deleted" });
};

// 🔹 USER: approved testimonials only
exports.getApprovedTestimonials = async (req, res) => {
  const testimonials = await Testimonial.find({ isApproved: true }).sort(
    "-createdAt"
  );

  res.json({ success: true, testimonials });
};
