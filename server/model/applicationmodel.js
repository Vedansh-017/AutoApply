import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  job: {
    company: String,
    role: String,
    location: String,
  },
  status: { type: String, default: "Applied" },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

const ApplicationModel = mongoose.models.Application || mongoose.model("Application", ApplicationSchema);

export default ApplicationModel;