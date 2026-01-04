const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendBookingStatusEmail = async ({
  to,
  name,
  status,
  serviceName,
  date,
  timeSlot,
  address,
}) => {
  if (!to) return;

  const niceStatus =
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  const subject = `Your PlumbGo booking is ${niceStatus}`;

  const html = `
    <div style="font-family: Arial, sans-serif; font-size:14px; color:#111">
      <h2>Hi ${name || "Customer"},</h2>
      <p>Your plumbing booking status has been updated:</p>
      <ul>
        <li><b>Status:</b> ${niceStatus}</li>
        <li><b>Service:</b> ${serviceName || "Plumbing Service"}</li>
        <li><b>Date:</b> ${date}</li>
        <li><b>Time:</b> ${timeSlot}</li>
        <li><b>Address:</b> ${address}</li>
      </ul>
      <p>If you have any questions, reply to this email.</p>
      <p>Regards,<br/>PlumbGo Team</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    console.log("📧 Booking status email sent to", to);
  } catch (err) {
    console.error("Email send error:", err.message);
  }
};

// ✅ NEW: Booking create hone par email
const sendBookingCreatedEmail = async ({
  to,
  name,
  serviceName,
  date,
  timeSlot,
  address,
}) => {
  if (!to) return;

  const subject = "✅ We received your booking - PlumbGo";

  const html = `
    <div style="font-family: Arial, sans-serif; font-size:14px; color:#111">
      <h2>Hi ${name || "Customer"},</h2>
      <p>Thank you for booking with <b>PlumbGo</b>. We have received your request.</p>
      <p>Our team will review your booking and confirm it soon.</p>
      <ul>
        <li><b>Service:</b> ${serviceName || "Plumbing Service"}</li>
        <li><b>Date:</b> ${date}</li>
        <li><b>Time:</b> ${timeSlot}</li>
        <li><b>Address:</b> ${address}</li>
      </ul>
      <p>You will get another email when your booking is <b>confirmed</b>.</p>
      <p>Regards,<br/>PlumbGo Team</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    console.log("📧 Booking created email sent to", to);
  } catch (err) {
    console.error("Booking created email error:", err.message);
  }
};

module.exports = {
  sendBookingStatusEmail,
    sendBookingCreatedEmail,

};
