import axios from 'axios';
import React, { useEffect, useCallback } from 'react';
import { createContext, useState } from 'react';
import { toast } from 'react-toastify';

export const AppContext = createContext();

export const AppContextProvider = (props) => {
    const [isLoading, setIsLoading] = useState(true);
    axios.defaults.withCredentials = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";
    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem('isLoggedIn') === 'true'
    );
    const [userData, setUserData] = useState(null);

    const getAuthState = useCallback(async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
            if (data.success) {
                setIsLoggedIn(true);
                await getUserData();
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.log(error)
            // ... error handling
        }
    }, [backendUrl]);

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
        getUserData
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};