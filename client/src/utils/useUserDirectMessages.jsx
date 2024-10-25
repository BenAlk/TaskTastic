import { useState, useEffect } from 'react'
import useMessageService from "../services/messageService"

const useUserDirectMessages = (projectId, userId) => {
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const messageService = useMessageService()

    const fetchDirectMessages = async () => {
        try {
            setLoading(true)
            const response = await messageService.getDirectMessages(projectId)
            const unreadDms = response.filter( message =>
                message.type === 'direct' &&
                message.recipient.includes(userId) &&
                !message.read.includes(userId)
            )

            setMessages(unreadDms)
        } catch (error) {
            setError(error.message)
            console.error('Error fetching direct messages:', error)
        } finally {
            setLoading(false)
        }
    }

    const markMessageAsRead = async (messageId) => {
        try {
            await messageService.markMessageAsRead(messageId)
            setMessages(prevMessages =>
                prevMessages.filter(msg => msg._id !== messageId)
            )
        } catch (error) {
            console.error('Error marking message as read:', error)
            throw error
        }
    }

    useEffect(() => {
        if(projectId && userId) {
            fetchDirectMessages()
        }
    }, [projectId, userId])

    return {
        messages,
        loading,
        error,
        refreshMessages: fetchDirectMessages,
        markMessageAsRead
    }
}

export default useUserDirectMessages
