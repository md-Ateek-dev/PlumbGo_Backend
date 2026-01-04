const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelMyBookings,
  getBookingStats,

} = require("../Controllers/Bookings_Controller");

const { protect } = require("../Middlewares/User_Middleware");
const { admin } = require("../Middlewares/Admin_Middleware");

// User routes
router.post("/Bookings", protect, createBooking);
router.get("/Bookings/my", protect, getMyBookings);
router.delete("/Bookings/my/:id", protect, cancelMyBookings); // 👈 NEW

// Admin routes
router.get("/Bookings", protect, admin, getAllBookings);
router.put("/Bookings/:id/status", protect, admin, updateBookingStatus);
router.get("/Bookings/stats", protect, admin, getBookingStats);

module.exports = router;
