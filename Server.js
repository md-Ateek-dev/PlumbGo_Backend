require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./Config/db");
const path = require("path");

dotenv.config(); // .env load karega

const userRoutes = require("./Routes/User_Routes");
const ServicesRoutes = require("./Routes/Services_Routes");
const bookingRoutes = require("./Routes/Bookings_Routes");
const paymentRoutes = require("./Routes/Payment_Routes");
const carouselRoutes = require("./Routes/Carousel_Routes");
const contactRoutes = require("./Routes/Contactus_Routes");
const blogRoutes = require("./Routes/Blogs_Routes");
const galleryRoutes = require("./Routes/Gallery_Routes");
const testimonialRoutes = require("./Routes/Testimonial_Routes");
const app = express();

// ✅ CORS CONFIG (yahin lagana hai, routes se pehle)
const corsOptions = {
  origin: [
        "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"

  ],
  credentials: true,
};

app.use(cors(corsOptions));

// ✅ Body parser
app.use(express.json());

// ✅ DB connect
connectDB();

// ✅ Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/User", userRoutes);
app.use("/Services", ServicesRoutes);
app.use("/", bookingRoutes);
app.use("/", paymentRoutes);
app.use("/", carouselRoutes);   // ✅ YE LINE ADD KARO
app.use("/", contactRoutes);
app.use("/", blogRoutes);
app.use("/", galleryRoutes);
app.use("/", testimonialRoutes);


// ✅ Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
