import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    verifyOtp: {
      type: String,
      default: "",
    },

    verifyOtpExpiryAt: {
      type: Number,
      default: 0,
    },

    isAccountVerified: {
      type: Boolean,
      default: false,
    },

    resetOtp: {
      type: String,
      default: "",
    },

    resetOtpExpiryAt: {
      type: Number,
      default: 0,
    },

    // 🔹 Profile Section
    profile: {
      phone: { type: String, default: "" },
      college: { type: String, default: "" },
      degree: { type: String, default: "" },
      graduationYear: { type: String, default: "" },
      skills: { type: [String], default: [] },
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;
