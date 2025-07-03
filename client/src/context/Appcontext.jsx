import axios from 'axios';
import React, { useEffect } from 'react';
import { createContext , useState } from 'react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = (props) => {

    axios.defaults.withCredentials = true;
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    // const frontendUrl = import.meta.env.VITE_FRONTEND_URL ;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);
     
    //  console.log("AppContext: backend_url loaded:", backendUrl);

    const getAuthState = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/auth/is-auth');

            if (data.success) {
                setIsLoggedIn(true)
                getUserData()

            } else {
                toast.error(error.message || 'Failed to fetch authentication state');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to fetch authentication state');
        }
    }   

    const getUserData = async () => {
        try {
            const {data} =await axios.get(backendUrl + '/api/user/data', {
  withCredentials: true,
});

            data.success ? setUserData(data.userData) : toast.error(data.message || 'Failed to fetch user data');
        } catch (error) {
           toast.error(error.message || 'Failed to fetch user data');
        }
    }

    useEffect(() => {
        getAuthState();
    }, []);
    const  value = {
        backendUrl,
        isLoggedIn,setIsLoggedIn, 
        userData, setUserData,
        getUserData
    }
        // Define any state or functions you want to provide to the context
    return (
        <>
        <AppContext.Provider value={value}>
            {props.children}
            </AppContext.Provider>
            </>
    );      
}