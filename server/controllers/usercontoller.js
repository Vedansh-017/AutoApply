import UserModel from "../model/usermodel.js";

export const getUserData = async (req, res) => {
  try {
    const userId = req.user.userId;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Fetch user and exclude sensitive fields
    const user = await UserModel.findById(userId).select("-password -verifyOtp -resetOtp");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      userData: {
        name: user.name,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
        isSubscribed: user.isSubscribed,
        subscriptionPlan: user.subscriptionPlan,
        subscriptionExpiry: user.subscriptionExpiry,
        searchCount: user.searchCount,
        hasActiveSubscription: user.hasActiveSubscription,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    });
  } catch (error) {
    console.error("Get user data error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.userId).select("profile name email");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, profile: user.profile, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { phone, college, degree, graduationYear, skills, github, linkedin } = req.body;

    const user = await UserModel.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

// 👇 Merge updates into existing profile
user.profile = {
  ...user.profile.toObject(), // keep existing fields
  phone: phone ?? user.profile.phone,
  college: college ?? user.profile.college,
  degree: degree ?? user.profile.degree,
  graduationYear: graduationYear ?? user.profile.graduationYear,
  skills: skills
    ? Array.isArray(skills)
      ? skills.map(s => s.trim()) // already array
      : skills.split(",").map(s => s.trim()) // string case
    : user.profile.skills,
  github: github ?? user.profile.github,
  linkedin: linkedin ?? user.profile.linkedin,
};

    await user.save();

    res.json({ success: true, message: "Profile updated", profile: user.profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
