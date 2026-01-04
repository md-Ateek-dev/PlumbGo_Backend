const express = require("express");
const router = express.Router();

const ctrl = require("../Controllers/Testimonial_Controller");
const { admin } = require("../Middlewares/Admin_Middleware");
const {protect} = require("../Middlewares/User_Middleware");

// USER (PUBLIC – approved only)
router.get("/testimonials", ctrl.getApprovedTestimonials);

// USER (submit)
router.post("/testimonials", ctrl.createTestimonial);

// ADMIN
router.get("/admin/testimonials", protect, admin, ctrl.getAdminTestimonials);
router.put("/admin/testimonials/:id", protect, admin, ctrl.updateTestimonialStatus);
router.delete("/admin/testimonials/:id", protect, admin, ctrl.deleteTestimonial);

module.exports = router;
