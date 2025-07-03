import React, { useState, useRef, useContext } from 'react';
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/Appcontext';
import { toast } from 'react-toastify';
import axios from 'axios';

const ResetPassword = () => {
  const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContext);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value.length === 1 && index < 5) inputRefs.current[index + 1]?.focus();
    else if (value.length === 0 && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text');
    for (let i = 0; i < inputRefs.current.length && i < pasted.length; i++) {
      inputRefs.current[i].value = pasted[i];
      if (i < inputRefs.current.length - 1) inputRefs.current[i + 1].focus();
    }
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
      if (data.success) {
        setIsEmailSent(true);
        setIsOtpSubmitted(false);
        toast.success('OTP sent to your email!');
      } else {
        toast.error(data.message || 'Failed to send OTP.');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred.');
    }
  };

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value);
    setOtp(otpArray.join(''));
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      if (data.success) {
        toast.success('Password reset successfully!');
        navigate('/login');
      } else {
        toast.error(data.message || 'Failed to reset password.');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white via-blue-100 to-sky-200 relative">
      {/* Logo */}
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="Logo"
        className="absolute top-5 left-5 sm:left-16 w-28 sm:w-32 cursor-pointer transition-transform hover:scale-105"
      />

      {/* Email Entry Form */}
      {!isEmailSent && (
        <form onSubmit={onSubmitEmail} className="w-full max-w-md bg-white/40 backdrop-blur-lg border border-white/30 p-8 sm:p-10 rounded-2xl shadow-2xl text-blue-900">
          <h1 className="text-3xl font-bold text-center mb-4 text-blue-800">Reset Password</h1>
          <p className="text-center mb-6 text-blue-700">Enter your registered email address.</p>

          <div className="mb-6 flex items-center gap-3 px-5 py-3 rounded-full bg-white border border-blue-200 focus-within:ring-2 ring-blue-300">
            <img src={assets.mail_icon} alt="Email" className="w-4 h-4" />
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent outline-none w-full text-blue-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-sky-600 text-white rounded-full font-semibold hover:opacity-90 transition-all">
            Submit
          </button>
        </form>
      )}

      {/* OTP Entry Form */}
      {isEmailSent && !isOtpSubmitted && (
        <form onSubmit={onSubmitOtp} className="w-full max-w-md bg-white/40 backdrop-blur-lg border border-white/30 p-8 sm:p-10 rounded-2xl shadow-2xl text-blue-900">
          <h1 className="text-3xl font-bold text-center mb-4 text-blue-800">Enter OTP</h1>
          <p className="text-center mb-6 text-blue-700">Enter the 6-digit code sent to your email.</p>

          <div className="mb-8 flex justify-center" onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)}
                onInput={(e) => handleInput(e, index)}
                required
                className="w-11 h-11 text-center text-blue-800 text-xl font-semibold bg-white border border-blue-200 rounded-md mx-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            ))}
          </div>

          <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-sky-600 text-white rounded-full font-semibold hover:opacity-90 transition-all">
            Verify OTP
          </button>
        </form>
      )}

      {/* New Password Form */}
      {isOtpSubmitted && isEmailSent && (
        <form onSubmit={onSubmitNewPassword} className="w-full max-w-md bg-white/40 backdrop-blur-lg border border-white/30 p-8 sm:p-10 rounded-2xl shadow-2xl text-blue-900">
          <h1 className="text-3xl font-bold text-center mb-4 text-blue-800">Set New Password</h1>
          <p className="text-center mb-6 text-blue-700">Enter your new password below.</p>

          <div className="mb-6 flex items-center gap-3 px-5 py-3 rounded-full bg-white border border-blue-200 focus-within:ring-2 ring-blue-300">
            <img src={assets.lock_icon} alt="Password" className="w-4 h-4" />
            <input
              type="password"
              placeholder="New Password"
              className="bg-transparent outline-none w-full text-blue-800"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-sky-600 text-white rounded-full font-semibold hover:opacity-90 transition-all">
            Reset Password
          </button>
        </form>
      )}
    </div>
  );
};

export default ResetPassword;
