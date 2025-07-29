import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
  planId: { type: String, required: true }, // Your internal plan ID (like "pro499")
  status: { 
    type: String, 
    enum: ['active', 'canceled', 'expired', 'pending'], 
    default: 'active' 
  },
  paymentMethod: String,
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  lastBillingDate: Date,
  nextBillingDate: Date
}, { _id: false });

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
    default: 0,
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

  // Subscription tracking
  searchCount: { 
    type: Number, 
    default: 0,
    min: 0
  },
  subscription: subscriptionSchema,
  isSubscribed: { 
    type: Boolean, 
    default: false 
  },
  subscriptionPlan: { 
    type: String, 
    enum: ['basic', 'pro'], 
    default: 'basic' 
  },
  subscriptionExpiry: { 
    type: Date 
  },
  subscriptionHistory: [subscriptionSchema],

  // Additional tracking
  lastSearchDate: Date,

}, {
  timestamps: true,
});

// Indexes
userSchema.index({ 'subscription.status': 1 });
userSchema.index({ subscriptionExpiry: 1 });

// Virtual property
userSchema.virtual('hasActiveSubscription').get(function() {
  return this.isSubscribed && this.subscriptionExpiry > new Date();
});

// Search logic
userSchema.methods.canSearch = function() {
  if (this.hasActiveSubscription) return true;
  return this.searchCount < 2;
};

userSchema.methods.incrementSearchCount = function() {
  if (!this.hasActiveSubscription) {
    this.searchCount += 1;
  }
  this.lastSearchDate = new Date();
  return this.save();
};

const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

export default UserModel;
