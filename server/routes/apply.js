import express from "express";
import { submitApplication, getApplications } from "../controllers/applyController.js";

const router = express.Router();

router.post("/submit", submitApplication);
router.get("/all", getApplications);

export default router;
