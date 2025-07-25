import express from "express";
import AppliedJob from "../model/AppliedJob.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();

// Save applied job
router.post("/submit", userAuth, async (req, res) => {
  try {
    const job = req.body.job;
    job.userId = req.user.userId;

    const existing = await AppliedJob.findOne({ userId: req.user.userId, job_url: job.job_url });
    if (existing) return res.json({ success: false, message: "Already applied" });

    const newJob = await AppliedJob.create(job);
    res.json({ success: true, job: newJob });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to save applied job" });
  }
});

// Get all applied jobs
router.get("/get", userAuth, async (req, res) => {
  try {
    const jobs = await AppliedJob.find({ userId: req.user.userId }).sort({ appliedAt: -1 });
    res.json({ success: true, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch applied jobs" });
  }
});

export default router;
