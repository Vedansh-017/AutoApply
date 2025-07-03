import express from "express";

const router = express.Router();

// Example stub
router.get("/top-companies", (req, res) => {
  const field = req.query.field;
  res.json([
    { company: "Google", role: "SWE Intern", location: "Remote" },
    { company: "Microsoft", role: "PM Intern", location: "Bangalore" }
  ]);
});

export default router;
