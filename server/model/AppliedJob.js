import mongoose from "mongoose";

const appliedJobSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  title: String,
  company: String,
  location: String,
  salary: String,
  job_url: String,
  type: String,
  posted: String,
  appliedAt: {
    type: Date,
    default: Date.now
  }
});


export default mongoose.model("AppliedJob", appliedJobSchema);