import { useEffect, useState } from "react"
import { useProjectContext } from "../../../context/ProjectContext"
import { useAuth } from "../../../context/AuthContext"
import useUserService from "../../../services/usersService"
import useMessageService from "../../../services/messageService"
import { ImportantIcon } from "../../../assets/icons"
import styles from "./QuickBoard.module.css"

const QuickBoard = () => {
    const { currentProject } = useProjectContext()
    const { currentUser } = useAuth()
    const messageService = useMessageService()
    const userService = useUserService()
    const [messages, setMessages] = useState([])
    const [senderDetails, setSenderDetails] = useState({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [markingRead, setMarkingRead] = useState({})

    useEffect(() => {
        const fetchBoardMessages = async () => {
            if(!currentProject?._id) return

            try {
                const boardMessages = await messageService.getBoardMessages(currentProject._id)

                const unreadMessages = boardMessages.filter(msg =>
                    !msg.read.includes(currentUser?._id)
                )
                setMessages(unreadMessages)
            } catch (error) {
                console.error('Error fetching board messages:', error)
                setError(error.message)
            }
        }
        fetchBoardMessages()
    }, [currentProject?._id, currentUser?._id])

    useEffect(() => {
        const fetchSenderDetails = async () => {
            if (!messages?.length) {
                setLoading(false)
                return
            }
            try {
                    const senderIds = [...new Set(messages.map(message => message.sender))]
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

    const handleAcknowledgeMessage = async (messageId) => {
        if(markingRead[messageId]) return

        try {
            setMarkingRead(prev => ({...prev, [messageId]: true}))
            await messageService.markMessageAsRead(messageId)
            setMessages(prevMessages =>
                prevMessages.filter(msg => msg._id !== messageId)
            )
        } catch (error) {
            console.error('Error marking message as read:', error)
        } finally {
            setMarkingRead(prev => ({...prev, [messageId]: false}))
        }
    }

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>
    if (!messages?.length) return <div className={styles['empty-messages']}>No board messages to display.</div>

    const sortedMessages = [...messages].sort((a, b) =>
        new Date(b.createdAt || b.timestamp) - new Date(a.createdAt || a.timestamp)
    )

    return (
        <div className={styles["quick-board-container"]}>
            <div className={styles["quick-board-header"]}>
                <h3>Quick Board</h3>
            </div>
            <div className={styles["quick-board"]}>
                {sortedMessages.map((message) => {
                    const sender = senderDetails[message.sender] || {}
                    const displayName = sender.firstName ?
                        `${sender.firstName} ${sender.lastName}`.trim() :
                        sender.email || 'Unknown User'

                    return (
                        <div key={message._id} className="quick-board-message-container">
                            <div className={styles["message-author"]}>{displayName}</div>
                            <div className={styles["message-header"]}>
                                <div className={styles["message-summary"]}>{message.summary}</div>
                            </div>
                            <div className={styles["message-body"]}>
                                <div className={`${styles.messageContent} ${styles.slimScroll}`}>
                                    <p>{message.content}</p>
                                </div>
                            </div>
                            <div className={styles["message-foot"]}>
                                <div className={styles["message-timestamp"]}>
                                    {new Date(message.createdAt || message.timestamp).toLocaleString(undefined, {
                                        day: 'numeric',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                    <div className={styles["message-foot-icons"]}>
                                        {message.type === 'important' && (
                                            <div className="important-icon" title="Important Message">
                                                <ImportantIcon height="15px" width="15px" />
                                            </div>
                                        )}
                                        <div
                                            className={`${styles.thumbsUpIcon} ${markingRead[message._id] ? styles.markingRead : ''}`}
                                            title="Acknowledge Message"
                                            onClick={() => handleAcknowledgeMessage(message._id)}
                                            style={{
                                                cursor: markingRead[message._id] ? 'wait' : 'pointer',
                                                opacity: markingRead[message._id] ? 0.5 : 1
                                            }}
                                        >
                                            {markingRead[message._id] ? '...' : '✔'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default QuickBoard
