import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AppContext } from './context/Appcontext.jsx';
import Profile from './pages/Profile.jsx'
import Dashboard from './pages/Dashboard.jsx'
import { useContext,useEffect,useState } from 'react';
import { Navigate } from 'react-router-dom';
import ResetPassword from './pages/ResetPassword.jsx'
import EmailVerify from './pages/EmailVerify.jsx'   
import Login from './pages/login.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import JobSearch from './pages/JobSearch.jsx'
import SavedJobs from './pages/SavedJobs.jsx'
import Home from "./pages/home.jsx";
import Navbar from './components/Navbar.jsx';
const App = () => {
  const { isLoggedIn } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Assume your auth check is async and sets isLoading(false) when done
    // This would be handled in your AppContext
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return (
    <div>
      <ToastContainer/>
      <Routes>

        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<><Navbar /><JobSearch /></>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/email-verify' element={<><Navbar /><EmailVerify/></>} />
        <Route path='/reset-password' element={<ResetPassword/>} />
        
        {/* Protected routes */}
        <Route path="/profile" element={isLoggedIn ? <><Navbar /> <Profile /></> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={isLoggedIn ?<><Navbar /> <Dashboard /></> : <Navigate to="/login" />} />
        <Route path="/saved" element={isLoggedIn ? <><Navbar /><SavedJobs /></> : <Navigate to="/login" />} />
        
        {/* fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )

}

export default App
