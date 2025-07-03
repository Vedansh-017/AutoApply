import React, { useEffect } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/Appcontext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
const EmailVerify = () => {
  const navigate = useNavigate();


  axios.defaults.withCredentials = true; // Ensure axios sends cookies with requests

  const {backendUrl,isLoggedIn,userData,getUserData}=useContext(AppContext)// Get the backend URL from environment variables
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


  const onSubmitHandler = async (e) => {
    try{
    e.preventDefault();
    const otp = inputRefs.current.map(e => e.value).join('');
    // Here you can handle the OTP submission, e.g., send it to your backend
    const {data} = await axios.post(backendUrl+'/api/auth/verify-account',{ otp });
    if(data.success){
      getUserData();
      toast.success('Email verified successfully!');
      navigate('/');
    }else{
      toast.error(data.message || 'Failed to verify email. Please try again.');
    }
    } catch (error) {
      toast.error('Error submitting OTP:', error.message);
    }
  }

useEffect(() => {
  isLoggedIn && userData && userData.isAccountVerified && navigate('/'); // Redirect if already logged in and account is verified
}, [isLoggedIn, userData]);


  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 ' >
            <img onClick={()=> navigate('/')}   src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>


            <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-indigo-300 text-sm'>

               <h1 className='text-white text-2xl font-semihold text-center mb-4'>Email verify OTP</h1>
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

               <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'> Verify Email</button>

            </form>
     
    </div>
  )
}

export default EmailVerify
