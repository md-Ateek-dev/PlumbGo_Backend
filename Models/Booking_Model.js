const mongoose = require("mongoose");
const Booking = require("../Models/Booking_Model");
const Service = require("../Models/Service_Model"); // ✅ FIXED

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    date: {
      type: String, // e.g. "2025-12-01"
      required: true,
    },
    timeSlot: {
      type: String, // e.g. "10:00 AM - 11:00 AM"
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    paymentMethod: {
      type:String,
      enum:["cod", "online"],
      default:"cod",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    }
    
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
