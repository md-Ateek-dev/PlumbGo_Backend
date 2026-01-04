const admin = (req, res, next) => {
  
  console.log("ADMIN MIDDLEWARE HIT");
  console.log("AUTH HEADER:", req.headers.authorization);
  
  if (req.user && req.user.role === "admin") {
    return next();
  }else {
    res.status(403).json({ message: "Admin access only" });
  }
};

module.exports = { admin };
