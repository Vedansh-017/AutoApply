import React, { useEffect, useRef, useContext } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/Appcontext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const EmailVerify = () => {
  const navigate = useNavigate();
  const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContext);

  axios.defaults.withCredentials = true;

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    const value = e.target.value;
    if (value.length === 1 && index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (value.length === 0 && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pastedValue = e.clipboardData.getData('text');
    for (let i = 0; i < inputRefs.current.length && i < pastedValue.length; i++) {
      inputRefs.current[i].value = pastedValue[i];
      if (i < inputRefs.current.length - 1) {
        inputRefs.current[i + 1].focus();
      }
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const otp = inputRefs.current.map(input => input.value).join('');
      const { data } = await axios.post(`${backendUrl}/api/auth/verify-account`, { otp });

      if (data.success) {
        getUserData();
        toast.success('Email verified successfully!');
        navigate('/');
      } else {
        toast.error(data.message || 'Failed to verify email. Please try again.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  useEffect(() => {
    if (isLoggedIn && userData?.isAccountVerified) {
      navigate('/');
    }
  }, [isLoggedIn, userData, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white via-blue-100 to-sky-200 relative">
      {/* Logo */}
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="Logo"
        className="absolute top-5 left-5 sm:left-16 w-28 sm:w-32 cursor-pointer transition-transform hover:scale-105"
      />

      {/* OTP Form */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-md bg-white/40 backdrop-blur-lg border border-white/30 p-8 sm:p-10 rounded-2xl shadow-2xl text-blue-900 animate-fadeIn"
      >
        <h1 className="text-3xl font-bold text-center mb-4 text-blue-800">Verify Your Email</h1>
        <p className="text-center mb-6 text-blue-700">Enter the 6-digit OTP sent to your email.</p>

        {/* OTP Inputs */}
        <div className="mb-8 flex justify-center" onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              ref={el => inputRefs.current[index] = el}
              onInput={(e) => handleInput(e, index)}
              required
              className="w-11 h-11 text-center text-blue-800 text-xl font-semibold bg-white border border-blue-200 rounded-md mx-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-sky-600 text-white rounded-full font-semibold hover:opacity-90 transition-all shadow-lg"
        >
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default EmailVerify;
