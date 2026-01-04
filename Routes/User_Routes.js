const express = require("express");
const { registerUser, loginUser, googleLogin } = require("../Controllers/User_Controller");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin, async (req, res) => {
  res.status(200).json({message: "Google login successful", user: req.user, token: req.token  });
});

module.exports = router;
