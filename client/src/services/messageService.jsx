import { useAuth } from '../context/AuthContext';

const useMessageService = () => {
    const { api } = useAuth();

    return {
        // Create and modify messages
        createMessage: async (projectId, type, content, recipients = [], parentMessage = null, metadata = {}) => {
            try {
                const response = await api.post('/messages', {
                    projectId,
                    type,
                    content: {
                        text: content,
                        mentions: [] // Will be parsed from content
                    },
                    recipients,
                    parentMessage,
                    metadata
                });
                return response.data;
            } catch (error) {
                console.error('Error creating message:', error);
                throw error;
            }
        },

        editMessage: async (messageId, content) => {
            try {
                const response = await api.put(`/messages/${messageId}`, {
                    content: {
                        text: content,
                        mentions: [] // Will be parsed from content
                    }
                });
                return response.data;
            } catch (error) {
                console.error('Error editing message:', error);
                throw error;
            }
        },

        deleteMessage: async (messageId) => {
            try {
                const response = await api.delete(`/messages/${messageId}`);
                return response.data;
            } catch (error) {
                console.error('Error deleting message:', error);
                throw error;
            }
        },

        // Fetch messages
        getBoardMessages: async (projectId) => {
            try {
                console.log('Fetching board messages for project:', projectId);
                const response = await api.get(`/messages/board/${projectId}`);

                // Log the response to see what we're getting
                console.log('Board messages response:', response.data);

                return response.data;
            } catch (error) {
                console.error('Error fetching board messages:', error);
                throw error;
            }
        },

        getDirectMessages: async (projectId) => {
            try {
                const response = await api.get(`/messages/direct/${projectId}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching direct messages:', error);
                throw error;
            }
        },

        getThreadMessages: async (messageId) => {
            try {
                const response = await api.get(`/messages/thread/${messageId}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching thread messages:', error);
                throw error;
            }
        },

        getDashboardMessages: async (projectId) => {
            try {
                const response = await api.get(`/messages/dashboard/${projectId}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching dashboard messages:', error);
                throw error;
            }
        },

        // Message interactions
        markMessageAsRead: async (messageId) => {
            try {
                const response = await api.put(`/messages/${messageId}/read`);
                return response.data;
            } catch (error) {
                console.error('Error marking message as read:', error);
                throw error;
            }
        },

        addReaction: async (messageId, emoji) => {
            try {
                const response = await api.post(`/messages/${messageId}/reaction`, {
                    emoji
                });
                return response.data;
            } catch (error) {
                console.error('Error adding reaction:', error);
                throw error;
            }
        },

        // Helper functions
        parseMentions: (content) => {
            const mentions = [];
            const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
            let match;

            while ((match = mentionRegex.exec(content)) !== null) {
                mentions.push({
                    user: match[2], // User ID
                    position: match.index
                });
            }

            return mentions;
        },

        formatMentions: (users) => {
            return users.map(user =>
                `@[${user.firstName} ${user.lastName}](${user._id})`
            );
        }
    };
};

export default useMessageService;
