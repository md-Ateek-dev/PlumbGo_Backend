const express = require("express");
const router = express.Router();
const { createOrder, verifyPayment } = require("../Controllers/Payment_Controller");
const { protect } = require("../Middlewares/User_Middleware"); // jo login ke liye use karte ho

// Sirf logged-in user payment kare
router.post("/payments/create-order", protect, createOrder);
router.post("/payments/verify", protect, verifyPayment);

module.exports = router;
