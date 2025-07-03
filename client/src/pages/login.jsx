import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/Appcontext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContext);

  const [formType, setFormType] = useState('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    if (!backendUrl) {
      toast.error("Backend URL not found.");
      return;
    }

    try {
      const response = formType === 'login'
        ? await axios.post(`${backendUrl}/api/auth/login`, { email, password })
        : await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });

      const data = response.data;

      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
        navigate('/');
        toast.success(data.message || 'Welcome!');
      } else {
        toast.error(data.message || 'Something went wrong.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Server Error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-white via-blue-100 to-sky-200">
      {/* Logo */}
      <img
        onClick={() => navigate('/')}
        src={assets.logo}
        alt="Logo"
        className="absolute top-5 left-5 sm:left-16 w-28 sm:w-32 cursor-pointer transition-transform hover:scale-105"
      />

      {/* Glassmorphic Form */}
      <div className="w-full max-w-md bg-white/40 backdrop-blur-lg border border-white/30 p-8 sm:p-10 rounded-2xl shadow-2xl text-gray-800 animate-fadeIn">
        <h2 className="text-3xl font-bold text-center mb-2 text-blue-800">
          {formType === 'signup' ? 'Create Account' : 'Welcome Back'}
        </h2>
        <p className="text-center text-sm mb-6 text-blue-600">
          {formType === 'signup' ? 'Sign up to get started' : 'Login to your account'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formType === 'signup' && (
            <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white border border-blue-200 focus-within:ring-2 ring-blue-300">
              <img src={assets.person_icon} alt="Name" />
              <input
                type="text"
                placeholder="Full Name"
                className="bg-transparent outline-none w-full placeholder-blue-400 text-blue-800"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white border border-blue-200 focus-within:ring-2 ring-blue-300">
            <img src={assets.mail_icon} alt="Email" />
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent outline-none w-full placeholder-blue-400 text-blue-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-white border border-blue-200 focus-within:ring-2 ring-blue-300">
            <img src={assets.lock_icon} alt="Password" />
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent outline-none w-full placeholder-blue-400 text-blue-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <p
            onClick={() => navigate('/reset-password')}
            className="text-blue-600 text-sm text-right hover:underline cursor-pointer"
          >
            Forgot Password?
          </p>

          <button
            type="submit"
            className="w-full py-2.5 mt-2 rounded-full bg-gradient-to-r from-blue-500 to-sky-600 hover:opacity-90 transition-all font-semibold text-white shadow-md"
          >
            {formType === 'signup' ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <div className="text-center text-sm mt-6 text-blue-700">
          {formType === 'signup' ? (
            <>
              Already have an account?{' '}
              <span
                onClick={() => setFormType('login')}
                className="underline cursor-pointer hover:text-blue-900"
              >
                Login here
              </span>
            </>
          ) : (
            <>
              Don’t have an account?{' '}
              <span
                onClick={() => setFormType('signup')}
                className="underline cursor-pointer hover:text-blue-900"
              >
                Sign up
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
