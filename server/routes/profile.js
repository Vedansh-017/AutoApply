import express from "express";
import { saveProfile, getProfile } from "../controllers/profileController.js";

const router = express.Router();

router.post("/save", saveProfile);
router.get("/get", getProfile);

export default router;
