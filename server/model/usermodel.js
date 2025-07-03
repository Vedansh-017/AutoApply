import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    verifyOtp: {
        type: String,
        default: '',
    },
verifyOtpExpiryAt: {
        type: Number,
        default:0,
    },
   isAccountVerified: {
        type: Boolean,
        default: false,
    },
    resetOtp: {
        type: String,
        default: '',
    },
    resetOtpExpiryAt: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});

const UserModel = mongoose.models.user || mongoose.model('User', userSchema);

export default UserModel;
// This code defines a Mongoose schema for a user model in a MongoDB database.