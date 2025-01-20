import { useAuth } from '../context/AuthContext'

const useMessageService = () => {
    const { api, isDemo } = useAuth()

    return {
        createMessage: async (projectId, type, content, recipients = [], parentMessage = null, metadata = {}) => {
            try {
                if (isDemo) {
                    throw new Error('Creating new messages is not available in demo mode')
                }
                const response = await api.post('/messages', {
                    projectId,
                    type,
                    content: {
                        text: content,
                        mentions: []
                    },
                    recipients,
                    parentMessage,
                    metadata
                })
                return response.data
            } catch (error) {
                if (error.response?.status === 403 && error.response.data?.message?.includes('demo')) {
                    throw new Error('Creating new messages is not available in demo mode')
                }
                console.error('Error creating message:', error)
                throw error
            }
        },

        editMessage: async (messageId, content) => {
            try {
                if (isDemo) {
                    throw new Error('Message modifications are not available in demo mode')
                }
                const response = await api.put(`/messages/${messageId}`, {
                    content: {
                        text: content,
                        mentions: []
                    }
                })
                return response.data
            } catch (error) {
                if (error.response?.status === 403 && error.response.data?.message?.includes('demo')) {
                    throw new Error('Message modifications are not available in demo mode')
                }
                console.error('Error editing message:', error)
                throw error
            }
        },

        deleteMessage: async (messageId) => {
            try {
                if (isDemo) {
                    throw new Error('Message deletion is not available in demo mode')
                }
                const response = await api.delete(`/messages/${messageId}`)
                return response.data
            } catch (error) {
                if (error.response?.status === 403 && error.response.data?.message?.includes('demo')) {
                    throw new Error('Message deletion is not available in demo mode')
                }
                console.error('Error deleting message:', error)
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

        getDirectMessages: async (projectId, options = {}) => {
            try {
                const params = new URLSearchParams()
                if (options.limit) params.append('limit', options.limit)
                if (options.before) params.append('before', options.before)

                const queryString = params.toString()
                const url = `/messages/direct/${projectId}${queryString ? `?${queryString}` : ''}`

                const response = await api.get(url)
                return response.data
            } catch (error) {
                console.error('Error fetching direct messages:', error)
                throw error
            }
        },

        getThreadMessages: async (messageId) => {
            try {
                const response = await api.get(`/messages/thread/${messageId}`)
                return response.data
            } catch (error) {
                console.error('Error fetching thread messages:', error)
                throw error
            }
        },

        getDashboardMessages: async (projectId) => {
            try {
                const response = await api.get(`/messages/dashboard/${projectId}`)
                return response.data
            } catch (error) {
                console.error('Error fetching dashboard messages:', error)
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

        addReaction: async (messageId, emoji) => {
            try {
                if (isDemo) {
                    throw new Error('Adding reactions is not available in demo mode')
                }
                const response = await api.post(`/messages/${messageId}/reaction`, {
                    emoji
                })
                return response.data
            } catch (error) {
                if (error.response?.status === 403 && error.response.data?.message?.includes('demo')) {
                    throw new Error('Adding reactions is not available in demo mode')
                }
                console.error('Error adding reaction:', error)
                throw error
            }
        },

        parseMentions: (content) => {
            const mentions = []
            const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g
            let match

            while ((match = mentionRegex.exec(content)) !== null) {
                mentions.push({
                    user: match[2],
                    position: match.index
                })
            }

            return mentions
        },

        formatMentions: (users) => {
            return users.map(user =>
                `@[${user.firstName} ${user.lastName}](${user._id})`
            )
        }
    }
}

export default useMessageService
