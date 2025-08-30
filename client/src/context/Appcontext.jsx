import axios from 'axios';
import React, { useEffect, useCallback } from 'react';
import { createContext, useState } from 'react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    axios.defaults.withCredentials = true;
    // const backendUrl = "https://autoapply-pcsgo.ondigitalocean.app" || "http://localhost:4000";
    const backendUrl = "http://localhost:4000"; // For local development
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem('isLoggedIn') === 'true'
    );
    const [userData, setUserData] = useState(null);

const getAuthState = async () => {
  try {
    const { data } = await axios.get(backendUrl + '/api/auth/is-auth', {
      withCredentials: true
    });

    if (data.success) {
      setIsLoggedIn(true);
      getUserData();
    } else {
      setIsLoggedIn(false);
      setUserData(null);
    }
  } catch (error) {
    // User not authenticated, just reset state — no need to toast
    if (error.response?.status !== 401) {
      console.error("Auth check failed:", error.message);
    }
    setIsLoggedIn(false);
    setUserData(null);
  }
};

    const getUserData = useCallback(async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/data');
            if (data.success) {
                setUserData(data.userData);
            } else {
                toast.error(data.message || 'Failed to fetch user data');
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch user data';
            toast.error(errorMessage);
        }
    }, [backendUrl]);

    useEffect(() => {
        getAuthState();
    }, [getAuthState]);

    const value = {
        backendUrl,
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        getUserData,
         isLoading
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};