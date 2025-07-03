import UserModel from "../model/usermodel.js";
export const getUserData = async (req, res) => {
    try {
        const userId = req.user.userId; // Get user ID from the request object set by middleware
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        
        // Fetch user data from the database
        const user = await UserModel.findById(userId).select("-password -verifyOtp -resetOtp"); // Exclude sensitive fields
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        
        return res.json({ success: true, userData:{
            name: user.name,
            email: user.email,
            isAccountVerified: user.isAccountVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        } });
    } catch (error) {
        console.error("Get user data error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}