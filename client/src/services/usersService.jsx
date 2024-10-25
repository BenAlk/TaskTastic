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
        }
    }
}

export default useUserService
