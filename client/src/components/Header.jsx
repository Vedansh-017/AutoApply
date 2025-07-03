import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/Appcontext.jsx'
const Header = () => {

  const {userData} = useContext(AppContext);
  return (
    <div className ='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
      <img src={assets.header_img} alt="" className='w-36 h-36 rounded-full mb-6' />
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>Hey {userData ? userData.name : 'Developer'}
         <img  className=" w-8 aspect-sqaure" src={assets.hand_wave} alt="" />
      </h1>
      <h2>Welcome to our App</h2>
      <p className='mb-8 max-w-md'>Let's start with a quick product tour and we will have  you  up and running in no time</p>
        <button className='bg-blue-500 text-white px-4 py-2 rounded-full mt-4 hover:bg-blue-600 transition-all'>
            Get Started <img src={assets.arrow_icon} alt="" className='inline-block ml-2 w-4 h-4' />
        </button>
    </div>
  )
}

export default Header
