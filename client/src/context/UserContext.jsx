import PropTypes from 'prop-types';
import { createContext, useContext, useState, useCallback } from 'react';
import useUserService from '../services/usersService';

const UserContext = createContext();

export const useUserContext = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    // Think of userCache like a phone book - once we look someone up, we remember their details
    const [userCache, setUserCache] = useState({});
    const userService = useUserService();

    // This is like looking up a single contact
    const getUserDetails = useCallback(async (userId) => {
        // First, check if we already have this user's info
        if (userCache[userId]) {
            return userCache[userId];
        }

        try {
            const userData = await userService.fetchUserDetails(userId);
            // Save this user's info for later
            setUserCache(prev => ({
                ...prev,
                [userId]: userData
            }));
            return userData;
        } catch (error) {
            console.error('Failed to fetch user details:', error);
            return null;
        }
    }, [userCache, userService]);

    const getMultipleUsers = useCallback(async (userIds) => {
        // Filter out IDs we already have
        const missingUserIds = userIds.filter(id => !userCache[id]);

        if (missingUserIds.length > 0) {
            try {
                const users = await userService.fetchMultipleUsers(missingUserIds);
                // Add all these users to our cache
                const newEntries = users.reduce((acc, user) => ({
                    ...acc,
                    [user._id]: user
                }), {});

                setUserCache(prev => ({
                    ...prev,
                    ...newEntries
                }));
            } catch (error) {
                console.error('Failed to fetch multiple users:', error);
            }
        }

        return userIds.map(id => userCache[id]).filter(Boolean);
    }, [userCache, userService]);

    const value = {
        getUserDetails,
        getMultipleUsers,
        userCache
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired
};
