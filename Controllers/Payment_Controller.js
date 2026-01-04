// const crypto = require("crypto");
// const razorpay = require("../Config/razorpay");
// const Booking = require("../Models/Booking_Model");
// const Service = require("../Models/Service_Model");

// // POST /payments/create-order
// // body: { bookingId }
// const createOrder = async (req, res) => {
//   try {
//     const { bookingId } = req.body;

//     const booking = await Booking.findById(bookingId).populate("service");
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     // amount in paise (₹299 => 29900)
//     const amount = booking.service.price * 100;

//     const options = {
//       amount,
//       currency: "INR",
//       receipt: `order_rcpt_${booking._id}`,
//       notes: {
//         bookingId: booking._id.toString(),
//         userId: booking.user.toString(),
//       },
//     };

//     const order = await razorpay.orders.create(options);

//     return res.json({
//       success: true,
//       order,
//       key: process.env.RAZORPAY_KEY_ID, // frontend ko yahi dena hoga
//     });
//   } catch (error) {
//     console.error("Create Razorpay order error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // POST /payments/verify
// // body: { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
// const verifyPayment = async (req, res) => {
//   try {
//     const {
//       bookingId,
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     } = req.body;

//     const body = razorpay_order_id + "|" + razorpay_payment_id;

//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//       .update(body.toString())
//       .digest("hex");

//     const isValid = expectedSignature === razorpay_signature;

//     if (!isValid) {
//       return res.status(400).json({ success: false, message: "Invalid signature" });
//     }

//     // ✅ payment valid: booking ko paid mark karo
//     await Booking.findByIdAndUpdate(bookingId, {
//       paymentStatus: "paid",
//     });
//     console.log("✅ Booking paymentStatus updated to PAID:", bookingId);

//     return res.json({
//       success: true,
//       message: "Payment verified successfully",
//     });
//   } catch (error) {
//     console.error("Verify Razorpay payment error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = {
//   createOrder,
//   verifyPayment,
// };
const crypto = require("crypto");
const razorpay = require("../Config/razorpay");
const Booking = require("../Models/Booking_Model");
const Service = require("../Models/Service_Model");
const { sendBookingStatusEmail } = require("../Utils/email");

// POST /payments/create-order
// body: { bookingId }
const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate("service");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // amount in paise (₹299 => 29900)
    const amount = booking.service.price * 100;

    const options = {
      amount,
      currency: "INR",
      receipt: `order_rcpt_${booking._id}`,
      notes: {
        bookingId: booking._id.toString(),
        userId: booking.user.toString(),
      },
    };

    const order = await razorpay.orders.create(options);

    return res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID, // frontend ko yahi dena hoga
    });
  } catch (error) {
    console.error("Create Razorpay order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /payments/verify
const verifyPayment = async (req, res) => {
  try {
    const {
      bookingId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // 1) Razorpay signature verify
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    // 2) Payment valid → update booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      {
        paymentStatus: "paid",
        paymentMethod: "online",
        status: "confirmed", // optional but recommended
         razorpay_order_id,
        razorpay_payment_id,
      },
      { new: true }
    );
    
 if (!updatedBooking) {
      return res.status(404).json({
         success: false,
         message: "Booking not found" });
    }
     // ★ 3) Populate for email
    const populated = await Booking.findById(updatedBooking._id)
      .populate("user", "name email")
      .populate("service", "name price");

    // ★ 4) Send "Booking Confirmed" email after payment
    try {
      if (populated?.user?.email) {
        await sendBookingStatusEmail({
          to: populated.user.email,
          name: populated.user.name,
          status: "confirmed",
          serviceName: populated.service?.name,
          date: populated.date,
          timeSlot: populated.timeSlot,
          address: populated.address,
        });

        console.log("✔ Email sent after online payment");
      }
    } catch (mailErr) {
      console.error("Payment email error:", mailErr.message);
    }


    return res.json({
      success: true,
      message: "Payment verified & Booking Confirmed successfully",
      booking: populated  || updatedBooking,
    });

  } catch (error) {
    console.error("Verify Razorpay payment error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
  createOrder,
  verifyPayment,
};
