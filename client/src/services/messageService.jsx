import { useAuth } from '../context/AuthContext'

const useMessageService = () => {
    const { api } = useAuth()

    return {
        createMessage: async (projectId, type, content, recipients = []) => {
            try {
                const response = await api.post('/messages', {
                    projectId,
                    type,
                    content,
                    recipients
                })
                return response.data
            } catch (error) {
                console.error('Error creating message:', error)
                throw error
            }
        },

        getBoardMessages: async (projectId) => {
            try {
                const response = await api.get(`/messages/board/${projectId}`)
                return response.data
            } catch (error) {
                console.error('Error fetching board messages:', error)
                throw error
            }
        },

        getDirectMessages: async (projectId) => {
            try {
                const response = await api.get(`/messages/direct/${projectId}`)
                return response.data
            } catch (error) {
                console.error('Error fetching direct messages:', error)
                throw error
            }
        },

        markMessageAsRead: async (messageId) => {
            try {
                const response = await api.put(`/messages/${messageId}/read`)
                return response.data
            } catch (error) {
                console.error('Error marking message as read:', error)
                throw error
            }
        },

        deleteMessage: async (messageId) => {
            try {
                const response = await api.delete(`/messages/${messageId}`)
                return response.data
            } catch (error) {
                console.error('Error deleting message:', error)
                throw error
            }
        },

        // searchMessages: async (projectId, userId) => {
        //     try {
        //         const response = await api.get(`/messages/search`, {
        //             params: {
        //                 projectId,
        //                 userId
        //             }
        //         })
        //         return response.data
        //     } catch (error) {
        //         console.error('Error searching messages:', error)
        //         throw error
        //     }
        // }
    }
}

export default useMessageService
