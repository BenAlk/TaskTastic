import { useState, useEffect, useCallback } from 'react'
import useMessageService from "../services/messageService"

const useUserDirectMessages = (projectId, userId) => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const messageService = useMessageService()

    const filterUnreadMessages = useCallback((allMessages) => {
        console.log('All messages before filtering:', allMessages)

        const filtered = allMessages.filter(message => {
            console.log('Message details:', {
                messageId: message._id,
                rawRecipients: message.recipients,
                recipientIds: message.recipients.map(r =>
                    typeof r === 'object' ? r._id || r : r
                ),
                userId,
                recipientsType: typeof message.recipients,
                firstRecipientType: message.recipients[0] ? typeof message.recipients[0] : 'none'
            })

            const recipientIds = message.recipients.map(r =>
                typeof r === 'object' ? r._id || r : r
            ).map(id => id.toString())
            const userIdStr = userId.toString()

            const isRecipient = recipientIds.includes(userIdStr)
            const isUnread = !Array.isArray(message.read) || !message.read.includes(userId)

            console.log('Evaluation:', {
                isRecipient,
                isUnread,
                recipientIds,
                userIdStr
            })

            return message.type === 'direct' && isRecipient && isUnread
        })

        return filtered
    }, [userId])

    const fetchDirectMessages = useCallback(async () => {
        console.log('Fetching messages with:', { projectId, userId })

        if (!projectId || !userId) {
            console.log('Missing required IDs:', { projectId, userId })
            return
        }

        try {
            setLoading(true)
            const response = await messageService.getDirectMessages(projectId)
            console.log('API Response:', response)

            if (!Array.isArray(response)) {
                throw new Error('Invalid response format')
            }

            const unreadDms = filterUnreadMessages(response)
            setMessages(unreadDms)
            setError(null)
        } catch (error) {
            console.error('DM fetch error:', error)
            setError('Failed to fetch messages')
            setMessages([])
        } finally {
            setLoading(false)
        }
    }, [projectId, userId, messageService, filterUnreadMessages])

    useEffect(() => {
        console.log('Effect running with IDs:', { projectId, userId })
        let mounted = true

        const loadMessages = async () => {
            if (mounted) {
                await fetchDirectMessages()
            }
        }

        loadMessages()

        return () => {
            mounted = false
            setMessages([])
            setError(null)
            setLoading(false)
        }
    }, [projectId, userId])

    const markMessageAsRead = async (messageId) => {
        if (!messageId) return

        try {
            await messageService.markMessageAsRead(messageId)
            setMessages(prev => prev.filter(msg => msg._id !== messageId))
        } catch (error) {
            console.error('Error marking as read:', error)
            throw new Error('Failed to mark as read')
        }
    }

    return {
        messages,
        loading,
        error,
        refreshMessages: fetchDirectMessages,
        markMessageAsRead
    }
}

export default useUserDirectMessages
