import { useEffect, useState } from "react"
import {  useProjectContext } from "../../../context/ProjectContext"
import useUserDirectMessages from "../../../utils/useUserDirectMessages"
import { useAuth } from "../../../context/AuthContext"
import useUserService from "../../../services/usersService"
import styles from "./QuickDm.module.css"

const QuickDm = () => {
    const { currentProject } = useProjectContext()
    const { currentUser } = useAuth()
    const userService = useUserService()
    const [senderDetails, setSenderDetails] = useState({})
    const [markingRead, setMarkingRead] = useState({})
    const {
        messages,
        loading: messagesLoading,
        error: messagesError,
        refreshMessages,
        markMessageAsRead
    } = useUserDirectMessages(currentProject?._id, currentUser?._id)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchSenderDetails = async () => {
            if (!messages?.length) {
                setLoading(false)
                return
            }
            try {
                    const senderIds = [...new Set(messages.map(message => message.from))]
                    const users = await userService.fetchMultipleUsers(senderIds)
                    const userMap = users.reduce((acc, user) => ({
                        ...acc,
                        [user._id]: user
                    }), {})
                    setSenderDetails(userMap)
            } catch (error) {
                console.error('Error fetching sender details:', error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchSenderDetails()
    }, [messages])

    const handleMarkAsRead = async (messageId) => {
        if (markingRead[messageId]) return;

        try {
            setMarkingRead(prev => ({ ...prev, [messageId]: true }))
            await markMessageAsRead(messageId)
            refreshMessages()
        } catch (err) {
            console.error('Error marking message as read:', err)
        } finally {
            setMarkingRead(prev => ({ ...prev, [messageId]: false }))
        }
    }

    if (messagesLoading || loading) return <div>Loading...</div>
    if (messagesError || error) return <div>Error: {messagesError || error}</div>
    if (!messages?.length) return <div>No direct messages to display.</div>

    return (
        <div className={styles["quick-dm-container"]}>
            <div className={styles["quick-dm-header"]}>
                <h3>Unread Direct Messages</h3>
            </div>
            {messages.map((message, index) => {
                const sender = senderDetails[message.sender] || {}
                const displayName = sender.firstName ?
                    `${sender.firstName} ${sender.lastName}`.trim() :
                    sender.email || 'Unknown User'

                return (
                    <div key={message._id || index} className={styles["dm-message-container"]}>
                        <div className={styles["dm-message-container-left"]}>
                            <div className={styles["dm-icon"]}>
                                {sender.avatar && (
                                    <img
                                        src={sender.avatar}
                                        alt={displayName}
                                        className={styles["dm-avatar"]}
                                    />
                                )}
                            </div>
                            <div className={styles["dm-details"]}>
                                <div className={styles["dm-message-author"]}>
                                    {displayName} : {new Date(message.timestamp || message.createdAt).toLocaleString(undefined, {
                                        day: 'numeric',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                                <div className={styles["dm-message-content"]}>{message.content}</div>
                            </div>
                        </div>
                        <div
                            className={styles["mark-read-icon"]}
                            onClick={() => handleMarkAsRead(message._id)}
                        >
                            ✔
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default QuickDm
