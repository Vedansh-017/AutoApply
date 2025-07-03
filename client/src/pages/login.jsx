import React, {useContext, useState} from 'react'
import { assets } from '../assets/assets.js'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/Appcontext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
const Login = () => {
    const navigate = useNavigate()

    const {backendUrl, setIsLoggedIn, getUserData} = useContext(AppContext)

    const [state , setState] = useState('Sign In')
    const[name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')  
    
  const OnSubmitHandler = async (e) => {
  e.preventDefault();
  axios.defaults.withCredentials = true;
    //  console.log("Login: backend_url =", backendUrl);

  try {
    let data;
    if (state === 'Login') {
      const response = await axios.post(`${backendUrl}/api/auth/login`, { email, password });
      data = response.data;
    } else {
      const response = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });
      data = response.data;
    }

    if (data.success) {
      setIsLoggedIn(true);
      getUserData();
      navigate('/');
    } else {
      toast.error(data.message || 'Something went wrong.');
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Something went wrong.');
  }
};

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400 '>
      <img onClick={()=> navigate('/')}   src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
        <div className='bg-slate-900 p-8 sm:p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state  === 'Sign In' ? 'Create account': 'Login'}</h2>
        <p className='text-center text-sm mb-6'>{state === 'Sign In' ? 'Create a new account': 'Login to  your account!'}</p>

        
        <form className='flex flex-col gap-2 mt-6' onSubmit={OnSubmitHandler}>
            {state === 'Sign In' && (
           <div className='mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]'>
             <img src={assets.person_icon} alt="" />
             <input onChange={e=> setName(e.target.value)} value={name} className='bg-transparent outline-none' type="text" placeholder='Full Name' required/>
           </div>
            )}
           <div className='mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]'>
             <img src={assets.mail_icon} alt="" />
             <input onChange={e=> setEmail(e.target.value)} value={email} className='bg-transparent outline-none' type="email" placeholder='Email' required/>
           </div>

            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2 rounded-full bg-[#333A5C]'>
             <img src={assets.lock_icon} alt="" />
             <input onChange={e=> setPassword(e.target.value)} value={password}  className='bg-transparent outline-none' type="password" placeholder='Password' required/>
           </div>
           <p onClick={()=> navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Forget Password?</p>

           <button className='w-full py-2.5 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-900 text-white font-medium'>{state}</button>
        </form>
       {state === 'Sign In'? (
        <p className='text-gray-400 text-center text-xs mt-4'> Already have an account?{' '} 
            <span  onClick={()=>setState('Login')} className='text-blue-400 cursor-pointer underline'> Login here</span>
        </p>
         ) :(
        <p className='text-gray-400 text-center text-xs mt-4'> Don't have an account?{' '} 
            <span onClick={()=>setState('Sign In')} className='text-blue-400 cursor-pointer underline'> Sign In</span>
        </p>
         )}
        

      </div>
    </div>
  )
}

export default Login
