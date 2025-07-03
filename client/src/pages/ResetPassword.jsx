import React from 'react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useContext } from 'react';
import { AppContext } from '../context/Appcontext';
import { toast } from 'react-toastify';
import axios from 'axios'
const ResetPassword = () => {

  const {backendUrl,isLoggedIn,userData,getUserData}=useContext(AppContext)
  axios.defaults.withCredentials = true; // Ensure axios sends cookies with requests

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState(0);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState('');

   const inputRefs=React.useRef([]); // Create a ref to store input elements
  
  
    const handleInput = (e, index) => {
      const value = e.target.value;
      if (value.length === 1 && index < 5) {
        // Move to the next input if the current input is filled
        inputRefs.current[index + 1].focus();
      } else if (value.length === 0 && index > 0) {
        // Move to the previous input if the current input is empty
        inputRefs.current[index - 1].focus();
      }
    }
  
    const handlePaste = (e) => {
      const pastedValue = e.clipboardData.getData('text');
      const inputs = inputRefs.current;
      
      // Fill the inputs with the pasted value
      for (let i = 0; i < inputs.length && i < pastedValue.length; i++) {
        inputs[i].value = pastedValue[i];
        if (i < inputs.length - 1) {
          inputs[i + 1].focus();
        }
      }
    }
  
   const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email });
      if (data.success) {
        setIsEmailSent(true);
        setIsOtpSubmitted(false);
        toast.success('OTP sent to your email!');
      } else {
        toast.error(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while sending OTP');
    }
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map(e => e.value)
    setOtp(otpArray.join(''));
    setIsOtpSubmitted(true);
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword });
      if (data.success) {
        toast.success('Password reset successfully!');
        navigate('/login');
      } else {
        toast.error(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred while resetting password');
    }
  }
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 ' >
                <img onClick={()=> navigate('/')}   src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
    
                {!isEmailSent &&
                <form  onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-indigo-300 text-sm'>
    
                   <h1 className='text-white text-2xl font-semihold text-center mb-4'>Reset password</h1>
                   <p className='text-center mb-6 text-indigo-300'>  Enter your registered email id.</p>
    
                   <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]' >
                          <img src={assets.mail_icon} alt=""  className='w-3 h-3'/>
                          <input type="email"  placeholder='Email id' className='bg-transparent outline-none text-white'
                          value={email} onChange={e => setEmail(e.target.value)} required/>
                   </div>
    
                   <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Submit</button>
    
                </form>
}

                {/* otp input form */}
                { isEmailSent && !isOtpSubmitted &&
                 <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-indigo-300 text-sm'>

               <h1 className='text-white text-2xl font-semihold text-center mb-4'>Rest Password OTP</h1>
               <p className='text-center mb-6 text-indigo-300'>  Enter the 6-digit code sent to youe email id.</p>

               <div className='mb-8 flex justify-center ' onPaste={handlePaste}>
                       {Array(6).fill(0).map((_, index) => (
                        <input 
                            key={index}
                            type="text" 
                            maxLength="1" 
                            className='w-10 h-10 text-center text-white bg-[#333A5C] rounded-md mx-1 text -xl'
                            required
                            ref={e => inputRefs.current[index] = e} 
                            onInput={(e)=> handleInput(e,index)}// Store each input in the ref array
                        />
                       ))}
               </div>

               <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'> Submit</button>

            </form>
}

{/* enter new password form */}
               { isOtpSubmitted && isEmailSent &&
                <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-indigo-300 text-sm'>
    
                   <h1 className='text-white text-2xl font-semihold text-center mb-4'>New password</h1>
                   <p className='text-center mb-6 text-indigo-300'>  Enter your new password below</p>
    
                   <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]' >
                          <img src={assets.lock_icon} alt=""  className='w-3 h-3'/>
                          <input type="password"  placeholder='Password' className='bg-transparent outline-none text-white'
                          value={newPassword} onChange={e => setNewPassword(e.target.value)} required/>
                   </div>
    
                   <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'>Submit</button>
    
                </form>
}
        </div>
  )
}

export default ResetPassword
