import ApplicationModel from "../model/applicationmodel.js";

export const submitApplication = async (req, res) => {
  try {
    const { userId, job } = req.body;
    const app = await ApplicationModel.create({ userId, job });
    res.status(201).json(app);
  } catch (err) {
    res.status(500).json({ error: "Failed to apply" });
  }
};

export const getApplications = async (req, res) => {
  try {
    const { userId } = req.query;
    const apps = await ApplicationModel.find({ userId });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};
