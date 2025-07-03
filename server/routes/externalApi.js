import express from "express";
import { fetchJobs } from "../controllers/externalAPIController.js";

const router = express.Router();

router.post("/jobs", fetchJobs);

export default router;
