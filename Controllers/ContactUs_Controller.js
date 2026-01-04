const Contacts = require("../Models/ContactUs_Model");

// POST /Contact  (public – user form)
const createContactMessage = async (req, res) => {
  try {
    const { name, phone, email, subject, message, city, preferredTime } =
      req.body;

    if (!name || !phone || !message) {
      return res
        .status(400)
        .json({ success: false, message: "Name, phone and message are required" });
    }

    const contact = await Contacts.create({
      name,
      phone,
      email,
      subject,
      message,
      city,
      preferredTime,
    });

    return res.status(201).json({
      success: true,
      message: "Contact message submitted successfully",
      contact,
    });
  } catch (err) {
    console.error("Create contact error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /admin/Contact  (admin only)
const getAllContactMessages = async (req, res) => {
  try {
    const messages = await Contacts.find().sort("-createdAt");
    return res.json({ 
      success: true,
       messages,
       });
  } catch (err) {
    console.error("Get contact messages error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createContactMessage,
  getAllContactMessages,
};
