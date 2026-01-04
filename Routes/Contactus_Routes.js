// const express = require("express");
// const router = express.Router();

// const {
//   createContactMessage,
//   getAllContactMessages,
// } = require("../Controllers/ContactUs_Controller");

// const { admin } = require("../Middlewares/Admin_Middleware");
// const { protect } = require("../Middlewares/User_Middleware");

// // user side
// router.post("/Contact", protect, createContactMessage);

// // admin side
// router.get("/admin/Contacts", admin, getAllContactMessages);

// module.exports = router;


const express = require("express");
const router = express.Router();

const {
  createContactMessage,
  getAllContactMessages,
} = require("../Controllers/ContactUs_Controller");

const { protect } = require("../Middlewares/User_Middleware");
const { admin } = require("../Middlewares/Admin_Middleware");

// USER SIDE — Anyone who is logged in can send message
router.post("/Contact", protect, createContactMessage);

// ADMIN SIDE — Only logged-in admins can view contact messages
router.get("/admin/Contacts", protect, admin, getAllContactMessages);

module.exports = router;
