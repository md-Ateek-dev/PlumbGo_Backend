const jwt = require("jsonwebtoken");
const User = require("../Models/User_Model"); // apne path ke hisaab se

const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    console.log("🔑 Token from header:", token); // DEBUG

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 👈 VERY IMPORTANT

    console.log("✅ Decoded token:", decoded); // DEBUG

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("❌ JWT error:", error.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

module.exports = { protect };
