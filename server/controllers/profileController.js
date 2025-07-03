import ProfileModel from "../model/profilemodel.js"

export const saveProfile = async (req, res) => {
  try {
    const { userId, resumeUrl, template } = req.body;
    const profile = await ProfileModel.findOneAndUpdate(
      { userId },
      { resumeUrl, template },
      { upsert: true, new: true }
    );
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Failed to save profile" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.query;
    const profile = await ProfileModel.findOne({ userId });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};
