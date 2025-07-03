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
    <nav className="bg-blue-700 text-white px-6 py-3 flex justify-between items-center">
      <div className="text-xl font-bold">AutoApply</div>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        {isLoggedIn && (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/profile" className="hover:underline">Profile</Link>
            <Link to="/saved" className="hover:underline">Saved Jobs</Link>
          </>
        )}
        {isLoggedIn ? (
          <button onClick={handleLogout} className="hover:underline">Logout</button>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/signup" className="hover:underline">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}
