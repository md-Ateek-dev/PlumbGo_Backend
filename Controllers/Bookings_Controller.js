const Booking = require("../Models/Booking_Model");
const Service = require("../Models/Service_Model"); // ✅ FIXED
const { sendBookingStatusEmail, 
        sendBookingCreatedEmail,   
  } = require("../Utils/email"); 

// POST /Bookings  (user – create booking)
const createBooking = async (req, res) => {
  try {
    const { service, date, timeSlot, address, notes, paymentMethod } = req.body;

    if (!service || !date || !timeSlot || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const finalPaymentMethod =
      paymentMethod && ["cod", "online"].includes(paymentMethod)
        ? paymentMethod
        : "cod";

    // 1) create booking doc
    const bookingDoc = await Booking.create({
      user: req.user._id, // protect middleware se aayega
      service,
      date,
      timeSlot,
      address,
      notes,
      paymentMethod: finalPaymentMethod,
    });

    // 2) populate for response & email (use Booking not booking)
    const booking = await Booking.findById(bookingDoc._id)
      .populate("user", "name email")
      .populate("service", "name price");

    // 3) send response immediately (so client gets 201)
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking: booking || bookingDoc,
    });

    // 4) FIRE & FORGET email — errors here won't affect response
    (async () => {
      try {
        if (booking && booking.user && booking.user.email) {
          await sendBookingCreatedEmail({
            to: booking.user.email,
            name: booking.user.name,
            serviceName: booking.service?.name,
            date: booking.date,
            timeSlot: booking.timeSlot,
            address: booking.address,
          });
          console.log("📧 Booking created email sent to", booking.user.email);
        }
      } catch (mailErr) {
        console.error("Booking created email error (non-fatal):", mailErr);
      }
    })();
  } catch (error) {
    console.error("Create booking error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};



// GET /Bookings/my  (logged-in user ki bookings)
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("service", "name price")
      .sort("-createdAt");

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Get my bookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /Bookings  (admin – all bookings)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email phone")
      .populate("service", "name price")
      .sort("-createdAt");

    res.json({ success: true, bookings });
  } catch (error) {
    console.error("Get all bookings error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /Bookings/:id/status  (admin – change status)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    let { status } = req.body;
console.log("REQ BODY:", req.body);
console.log("RAW STATUS:", req.body.status);

    // status normalize
    status = (status || "").toLowerCase().trim();

    const allowedStatuses = ["pending", "confirmed", "completed", "cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value. Allowed: pending, confirmed, completed, cancelled",
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

     // ✅ Ab yahi booking ko populate karke email bhejo
    const populated = await Booking.findById(booking._id)
      .populate("user", "name email")
      .populate("service", "name price");

    // background me email (await hata bhi sakte ho agar slow lage)
    if (populated && populated.user && populated.user.email) {
      sendBookingStatusEmail({
        to: populated.user.email,
        name: populated.user.name,
        status: populated.status,
        serviceName: populated.service?.name,
        date: populated.date,
        timeSlot: populated.timeSlot,
        address: populated.address,
      });
    }
    
    
    res.json({ success: true, booking:populated || booking });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};




// DELETE /Bookings/my/:id  (user – cancel own booking)
const cancelMyBookings = async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findOne({
      _id: bookingId,
      user: req.user._id, // sirf apni booking cancel kar sakta hai
    });

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Agar already completed/cancelled hai to allow nahi karna
    if (["completed", "cancelled"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel a ${booking.status} booking`,
      });
    }

    booking.status = "cancelled";
    await booking.save();

    return res.json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Cancel my booking error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /Bookings/stats  (admin only)
const getBookingStats = async (req, res) => {
  try {
    const total = await Booking.countDocuments();

    const pending = await Booking.countDocuments({ status: "pending" });
    const confirmed = await Booking.countDocuments({ status: "confirmed" });
    const completed = await Booking.countDocuments({ status: "completed" });
    const cancelled = await Booking.countDocuments({ status: "cancelled" });

    const onlinePaid = await Booking.countDocuments({
      paymentMethod: "online",
      paymentStatus: "paid",
    });
    
     // ✅ NEW: Cash on Delivery bookings (chahe paid/pending jo bhi ho)
    const cashOnDelivery = await Booking.countDocuments({
      paymentMethod: "cod",
    });
const serviceCollectionName =
      Service.collection && Service.collection.collectionName
        ? Service.collection.collectionName
        : "services"; // fallback
    // total revenue from paid bookings (assume service.price)
    const revenueAgg = await Booking.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $lookup: {
          from: serviceCollectionName,
          localField: "service",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$service" },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$service.price" },
        },
      },
    ]);

    const totalRevenue =
      revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    res.json({
      success: true,
      stats: {
        total,
        pending,
        confirmed,
        completed,
        cancelled,
        onlinePaid,
        cashOnDelivery,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Get booking stats error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
  cancelMyBookings,
  getBookingStats,
};
