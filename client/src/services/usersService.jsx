import { useAuth } from '../context/AuthContext'

const useUserService = () => {
    const { api } = useAuth()

    return {
        fetchUserDetails: async (userId) => {
            try {
                const response = await api.get(`/users/${userId}`)
                return response.data
            } catch (error) {
                console.error('Error fetching user details:', error)
                throw error
            }
        },
        fetchMultipleUsers: async (userIds) => {
            try {
                const response = await api.post('/users/batch', { userIds })
                return response.data
            } catch (error) {
                console.error('Error fetching multiple users:', error)
                throw error
            }
        },
        searchUsers: async (email) => {
            try {
                const response = await api.get(`/users?email=${encodeURIComponent(email)}`)
                return response.data
            } catch (error) {
                console.error('Error searching users:', error)
                throw error
            }
        },
        updateProfile: async (userId, updates) => {
            try {
                const response = await api.patch(`/users/${userId}`, updates)
                return response.data
            } catch (error) {
                console.error('Error updating profile:', error)
                throw error
            }
        },
        updatePassword: async (userId, currentPassword, newPassword) => {
            try {
                const response = await api.patch(`/users/${userId}/password`, {
                    currentPassword,
                    newPassword
                })
                return response.data
            } catch (error) {
                if (error.response?.status === 401) {
                    throw new Error('Current password is incorrect')
                }
                throw error
            }
        }
    }
}

export default useUserService
