import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../model/usermodel.js';
import transporter from '../config/nodemailer.js';
export const register = async (req, res) => {
    const { name, email, password } = req.body;
      if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
    try {
        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create new user
        const newUser = new UserModel({ name, email, password: hashedPassword });
        await newUser.save();

     

        const token = jwt.sign(
            { userId: newUser._id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
            maxAge : 7*24*60*60*1000// Prevent CSRF attacks
        });
          const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Our Service',
            text: `Hello ${name},\n\nThank you for registering with us! We're excited to have you on board.\n\nBest regards,\nYour Team`    
          }

          await transporter.sendMail(mailOptions);

          return  res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ success:false,message: error.message || "Internal server error" });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        // Check if user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }
        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        // Generate JWT token 
        // and authentaiction of ser willl be done nd user will be logged in
        // and set it in a cookie
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
            maxAge : 7*24*60*60*1000// Prevent CSRF attacks
        });

       return  res.json({ success :true, message: "Login successful" });

    } catch (error) {
        console.error("Login error:", error);
        return res.json({ success :false, message: "Internal server error" });
    }
}

export const logout = async (req, res) => {
    try {
        // Clear the cookie by setting its maxAge to 0
        res.clearCookie('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', 
        });
        return res.json({ success: true, message: "Logout successful" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const sendVerifyOtp = async (req, res) => {
    
    try {
        // Check if user exists
        const userId = req.user; // ✅ Already set by middleware

        const user = await UserModel.findById(req.user.userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        if (user.isAccountVerified) {
            return res.status(400).json({success:false, message: "Account already verified" });
        }
        // Generate OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpiryAt = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
        await user.save();

        // Send OTP via email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Verify Your Email',
            text: `Your verification OTP is ${otp}. Verify your account using this OTP.It is valid for 5 minutes.`
        };
        
        await transporter.sendMail(mailOptions);

         res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error("Send OTP error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const verifyEmail = async (req, res) => {
    const {otp } = req.body;
    const userId = req.user.userId; // ✅ Already set by middleware
    if (!userId || !otp) {
        return res.status(400).json({ success:false,message: "Email and OTP are required" });
    }
    try {
        // Check if user exists
        const user = await UserModel.findById(req.user.userId);
        if (!user) {
            return res.status(400).json({ success:false,message: "User not found" });
        }
        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account already verified" });
        }
        // Check OTP validity
        if (user.verifyOtp !== otp || Date.now() > user.verifyOtpExpiryAt) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }
        // Mark account as verified
        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiryAt = 0;
        await user.save();

        return res.json({ success: true, message: "Account verified successfully" });
    } catch (error) {
        console.error("Verify OTP error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const isAccountVerified = async (req, res) => {  
    try {
        const user = req.user; 
        return res.json({ success: true, isAccountVerified: user.isAccountVerified });
    } catch (error) {
         res.status(500).json({ success: false, message: error.message });
    }
}          

// send password reset OTP
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }
    try {
        // Check if user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        // Generate OTP
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpiryAt = Date.now() + 15 * 60 * 1000; // OTP valid for 5 minutes
        await user.save();

        // Send OTP via email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your password reset OTP is ${otp}. It is valid for 5 minutes.`
        };
        
        await transporter.sendMail(mailOptions);

         return res.json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        console.error("Send Reset OTP error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: "Email, OTP and new password are required" });
    }
    try {
        // Check if user exists
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        // Check OTP validity
        if (user.resetOtp !== otp || Date.now() > user.resetOtpExpiryAt) {
            return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
        }
        // Update password
        user.password = await bcrypt.hash(newPassword, 10);
        user.resetOtp = '';
        user.resetOtpExpiryAt = 0;
        await user.save();

         return res.json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.error("Reset Password error:", error);
         return res.status(500).json({ success: false, message: error.message });
    }
}