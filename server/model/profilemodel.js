import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  resumeUrl: { type: String, required: true },
  template: { type: String },
}, { timestamps: true });

const ProfileModel = mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
export default ProfileModel;
