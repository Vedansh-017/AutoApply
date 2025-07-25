import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/Appcontext";

export default function Navbar() {
  const { isLoggedIn, setIsLoggedIn, setUserData } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserData(null);
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo/Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tight flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              AutoApply
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition duration-300"
            >
              Home
            </Link>
            
            {isLoggedIn && (
              <>
                {/* <Link 
                  to="/dashboard" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition duration-300"
                >
                  Dashboard
                </Link> */}
                <Link 
                  to="/profile" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition duration-300"
                >
                  Profile
                </Link>
                <Link 
                  to="/saved" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition duration-300"
                >
                  Saved Jobs
                </Link>
                <Link 
                  to="/search" 
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition duration-300"
                >
                  Search Jobs
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-blue-700 rounded-md text-sm font-medium hover:bg-gray-100 transition duration-300 shadow-sm"
              >
                Logout
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-800 transition duration-300"
                >
                  Login
                </Link>
                <Link 
                  to="/login" 
                  className="px-4 py-2 bg-white text-blue-700 rounded-md text-sm font-medium hover:bg-gray-100 transition duration-300 shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-white hover:bg-blue-800 focus:outline-none"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu (hidden by default) */}
      <div className="md:hidden hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link 
            to="/" 
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
          >
            Home
          </Link>
          
          {isLoggedIn && (
            <>
              <Link 
                to="/dashboard" 
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              >
                Dashboard
              </Link>
              <Link 
                to="/profile" 
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              >
                Profile
              </Link>
              <Link 
                to="/saved" 
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
              >
                Saved Jobs
              </Link>
            </>
          )}
          
          <div className="pt-4 border-t border-blue-500">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-white text-blue-700 hover:bg-gray-100"
              >
                Logout
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-800"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-white text-blue-700 hover:bg-gray-100 mt-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}