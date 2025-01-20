import { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useMessage } from '../../../context/MessageContext'
import { useProjectContext } from '../../../context/ProjectContext'
import { useAuth } from '../../../context/AuthContext'
import { CheckCircle } from 'lucide-react'
import MessageComposer from '../MessageComposer/MessageComposer'
import BoardMessage from '../BoardMessage/BoardMessage'
import styles from './QuickBoard.module.css'

const QuickBoard = ({ scrollToMessageId }) => {
    const messagesEndRef = useRef(null)

    const [replyingTo, setReplyingTo] = useState(null)
    const [expandedThreads, setExpandedThreads] = useState(new Set())
    const [loading, setLoading] = useState(true)
    const [deletedMessages, setDeletedMessages] = useState(new Set())
    const [highlightState, setHighlightState] = useState({
        messageId: scrollToMessageId,
        isActive: Boolean(scrollToMessageId)
    })

    const { currentProject } = useProjectContext()
    const { currentUser } = useAuth()
    const {
        createMessage,
        fetchBoardMessages,
        markMessagesAsRead,
        boardMessages = [],
        error
    } = useMessage()

    useEffect(() => {
        if (!currentProject?._id) return

        const loadMessages = async () => {
            setLoading(true)
            try {
                await fetchBoardMessages(currentProject._id)
            } catch (error) {
                console.error('Failed to fetch messages:', error)
            } finally {
                setTimeout(() => setLoading(false), 300)
            }
        };

        loadMessages()
        setExpandedThreads(new Set())
    }, [currentProject?._id])

    useEffect(() => {
        if (scrollToMessageId && !loading) {
            const threadId = Object.entries(organizeThreads(boardMessages))
                .find(([_, thread]) =>
                    thread.root._id === scrollToMessageId ||
                    thread.replies.some(reply => reply._id === scrollToMessageId)
                )?.[0]

            if (threadId) {
                setExpandedThreads(prev => new Set([...prev, threadId]))
                setHighlightState({
                    messageId: scrollToMessageId,
                    isActive: true
                })

                setTimeout(() => {
                    const messageElement = document.getElementById(`message-${scrollToMessageId}`)
                    if (messageElement) {
                        messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }
                }, 100)
            }
        }
    }, [scrollToMessageId, loading, boardMessages])

    const isMessageUnread = (message) => {
        return !message.read.includes(currentUser._id)
    };

    const handleMarkAsRead = async (messageId) => {
        try {
            await markMessagesAsRead([messageId])
        } catch (error) {
            console.error('Failed to mark message as read:', error)
        }
    }

    // Handle marking an entire thread as read
    const handleMarkThreadAsRead = async (threadId, replies) => {
        try {
            const messageIds = [threadId]
            replies.forEach(reply => {
                if (isMessageUnread(reply)) {
                    messageIds.push(reply._id)
                }
            });

            if (messageIds.length > 0) {
                await markMessagesAsRead(messageIds)
            }

        } catch (error) {
            console.error('Failed to mark thread as read:', error)
        }
    };

    const handleNewMessage = async (content) => {
        if (!currentProject?._id) return

        try {
            await createMessage(
                currentProject._id,
                'board',
                content,
                [],
                replyingTo
            );
            setReplyingTo(null)
        } catch (error) {
            console.error('Failed to create message:', error)
            alert('Failed to create message. Please try again.')
        }
    };

    const handleMessageDeleted = (messageId) => {
        setDeletedMessages(prev => new Set([...prev, messageId]))
    };

    const handleMessageClick = (messageId) => {
        if (messageId === highlightState.messageId) {
            setHighlightState(prev => ({
                ...prev,
                isActive: false
            }))
        }
    }

    const shouldHighlight = (messageId) => {
        return messageId === highlightState.messageId && highlightState.isActive
    }

    const organizeThreads = (messages) => {
        const activeMessages = messages.filter(msg => !deletedMessages.has(msg._id))

        return activeMessages.reduce((acc, message) => {
            if (!message.parentMessage) {
                if (!acc[message._id]) {
                    acc[message._id] = {
                        root: message,
                        hasReplies: false,
                        replies: []
                    }
                } else {
                    acc[message._id].root = message
                }
            } else {
                const parentId = message.parentMessage
                if (!acc[parentId]) {
                    acc[parentId] = {
                        root: null,
                        hasReplies: true,
                        replies: [message]
                    }
                } else {
                    acc[parentId].hasReplies = true
                    acc[parentId].replies.push(message)
                }
            }
            return acc
        }, {})
    }

    const toggleThread = (threadId) => {
        setExpandedThreads(prev => {
            const newSet = new Set(prev)
            if (newSet.has(threadId)) {
                newSet.delete(threadId)
            } else {
                newSet.add(threadId)
            }
            return newSet
        })
    }

    const renderThread = (threadId, thread, isExpanded) => {
        const hasUnreadReplies = thread.replies.some(isMessageUnread)
        const isThreadUnread = isMessageUnread(thread.root) || hasUnreadReplies

        return (
            <div
                key={threadId}
                className={`
                    ${styles['message-thread']}
                    ${shouldHighlight(thread.root._id) ? styles['highlighted-message'] : ''}
                    ${isThreadUnread ? styles['unread'] : ''}
                `}
                id={`message-${thread.root._id}`}
                onClick={() => handleMessageClick(thread.root._id)}
            >
                <div className={styles['thread-header']}>
                    <BoardMessage
                        message={thread.root}
                        hasReplies={thread.hasReplies}
                        onReply={() => setReplyingTo(thread.root._id)}
                        onDeleteSuccess={handleMessageDeleted}
                        isUnread={isMessageUnread(thread.root)}
                    />

                    <div className={styles['thread-actions']}>
                        {isThreadUnread && (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkThreadAsRead(thread.root._id, thread.replies);
                                }}
                                className={styles['mark-read-button']}
                                title="Mark thread as read"
                            >
                                <CheckCircle className={styles['check-icon']} />
                                Mark as read
                            </div>
                        )}

                        {thread.replies.length > 0 && (
                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleThread(threadId);
                                }}
                                className={styles['toggle-thread-button']}
                            >
                                {isExpanded ?
                                    'Hide replies' :
                                    `Show ${thread.replies.length} ${
                                        thread.replies.length === 1 ? 'reply' : 'replies'
                                    } ${hasUnreadReplies ? '(new)' : ''}`
                                }
                            </div>
                        )}
                    </div>
                </div>

                {thread.replies.length > 0 && isExpanded && (
                    <div className={styles['thread-replies']}>
                        {thread.replies
                            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                            .map(reply => (
                                <div
                                    key={reply._id}
                                    className={`
                                        ${styles['reply-message']}
                                        ${shouldHighlight(reply._id) ? styles['highlighted-message'] : ''}
                                        ${isMessageUnread(reply) ? styles['unread'] : ''}
                                    `}
                                    id={`message-${reply._id}`}
                                    onClick={() => handleMessageClick(reply._id)}
                                >
                                    <BoardMessage
                                        message={reply}
                                        hasReplies={false}
                                        isReply={true}
                                        onReply={() => setReplyingTo(thread.root._id)}
                                        onDeleteSuccess={handleMessageDeleted}
                                        isUnread={isMessageUnread(reply)}
                                    />
                                    {isMessageUnread(reply) && (
                                        <div
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleMarkAsRead(reply._id);
                                            }}
                                            className={styles['mark-read-button']}
                                            title="Mark as read"
                                        >
                                            <CheckCircle className={styles['check-icon']} />
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                )}
            </div>
        )
    }

    if (!currentProject) {
        return (
            <div className={styles['quickboard-container']}>
                <div className={styles['message-info']}>
                    Please select a project first.
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className={styles['quickboard-container']}>
                <div className={styles['message-info']}>
                    <div className={styles['loading-skeleton']}>
                        <div className={styles['skeleton-message']} />
                        <div className={styles['skeleton-message']} />
                        <div className={styles['skeleton-message']} />
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className={styles['quickboard-container']}>
                <div className={styles['message-error']}>
                    Error: {error}
                </div>
            </div>
        )
    }

    const threadedMessages = organizeThreads(boardMessages)

    return (
        <div className={styles['quickboard-container']}>
            <div className={styles['composer-section']}>
                <MessageComposer
                    onSubmit={handleNewMessage}
                    replyingTo={replyingTo}
                    onCancelReply={() => setReplyingTo(null)}
                    placeholder="Share something with your team..."
                />
            </div>

            <div className={styles['messages-section']} ref={messagesEndRef}>
                {Object.entries(threadedMessages)
                    .filter(([_, thread]) => thread.root)
                    .sort(([_, a], [__, b]) =>
                        new Date(b.root.createdAt) - new Date(a.root.createdAt)
                    )
                    .map(([threadId, thread]) =>
                        renderThread(threadId, thread, expandedThreads.has(threadId))
                    )}
            </div>
        </div>
    )
}

QuickBoard.propTypes = {
    scrollToMessageId: PropTypes.string
}

export default QuickBoard
