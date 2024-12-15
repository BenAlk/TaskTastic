import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);
    const verifyingRef = useRef(false);



    const api = axios.create({
        baseURL: 'http://localhost:3001/',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Request Interceptor for API calls
    api.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Response Interceptor for API calls
    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                setCurrentUser(null);
                setAuthError('Session expired. Please log in again.');
            }
            return Promise.reject(error);
        }
    );

    const verifyToken = useCallback(debounce(async () => {
        if (verifyingRef.current) return;
        verifyingRef.current = true;

        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await api.get('/auth/me');
                setCurrentUser(response.data);
            } catch (error) {
                console.error('Error verifying token:', error);
                localStorage.removeItem('token');
                setCurrentUser(null);
            }
        } else {
            setCurrentUser(null);
        }
        setLoading(false);
        verifyingRef.current = false
    }, 1000),[]);

    useEffect(() => {
        verifyToken();

        const handleFocus = () => verifyToken();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [verifyToken]);

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.token  && response.data.userID) {
                localStorage.setItem('token', response.data.token);
                try {
                    const userResponse = await api.get('auth/me')
                    if(userResponse.data) {
                        setCurrentUser(userResponse.data);
                        setAuthError(null);
                        return { success: true };
                    } else {
                        throw new Error('No user data received')
                    }
                } catch (userError) {
                    console.error('Error fetching user data:', userError)
                    localStorage.removeItem('token');
                    throw new Error('Fales to get user data after login')
                }
            } else {
                throw new Error('Invalid login response structure')
            }
        } catch (error) {
                console.error('Login error:', error);
                setAuthError('Login failed. Please check your credentials.');
                return { success: false, error: error.response?.data?.message || 'Login failed' };

        }
    };

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setCurrentUser(null);
        setAuthError(null);
    }, []);

    const value = {
        currentUser,
        login,
        logout,
        loading,
        authError,
        api
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
