// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },

//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     password: {
//       type: String,
//       required: function () {
//         return !this.authProvider === "local";
//       },
//       select: false
//     },

//     phone: {
//       type: String,
//       required: function () {
//         return !this.authProvider === "local";
//       },
//     },

//     authProvider: {
//       type: String,
//       enum: ["local", "google"],
//       default: "local",
//     },

//     googleId: {
//       type: String,
//     },
//   },
//   { timestamps: true }
// );

// // ✅ Updated pre-save middleware
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password") || this.authProvider !== "local"){
//     return next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // ✅ password compare
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model("User", userSchema);
// module.exports = User;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    password: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
      select: false,
    },

    phone: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
    },
role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: String,
    avatar: String,
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  if (!this.password) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
