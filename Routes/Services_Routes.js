const express = require("express");
const {
  getServices,
  createService,
  updateService,
  deleteService,
} = require("../Controllers/Services_Controller");

const { protect } = require("../Middlewares/User_Middleware");
const { admin } = require("../Middlewares/Admin_Middleware");

const router = express.Router();

// Public route
router.get("/", getServices);

// Admin-only routes
router.post("/", protect, admin, createService);
router.put("/:id", protect, admin, updateService);
router.delete("/:id", protect, admin, deleteService);

module.exports = router;
