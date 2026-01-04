const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: String, // e.g. "30 min", "1 hour"
      default: "",
    },
  },
  { timestamps: true }
);

const Servise = mongoose.model("Service", serviceSchema);
module.exports = Servise;