import { useState, useEffect, useRef } from 'react'
import { useMessage } from '../../../context/MessageContext'
import useMessageService from '../../../services/messageService'
import { useProjectContext } from '../../../context/ProjectContext'
import { useAuth } from '../../../context/AuthContext'
import { useLocation } from 'react-router-dom'
import MessageComposer from '../MessageComposer/MessageComposer'
import NewMessageModal from '../NewMessageModal/NewMessageModal'
import styles from './DirectMessages.module.css'

const DirectMessages = () => {
    const location = useLocation()
    const messagesEndRef = useRef(null)
    const messageContainerRef = useRef(null)

    const [selectedUser, setSelectedUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [conversations, setConversations] = useState([])
    const [showNewMessageModal, setShowNewMessageModal] = useState(false)
    const [initialLoad, setInitialLoad] = useState(true)

    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [hasMoreMessages, setHasMoreMessages] = useState(true)
    const [oldestMessageDate, setOldestMessageDate] = useState(null)

    const { currentProject } = useProjectContext()
    const { currentUser } = useAuth()
    const { createMessage, markMessagesAsRead } = useMessage()
    const messageService = useMessageService()

    const loadDirectMessages = async (loadMore = false) => {
        if (!currentProject?._id) return

        const currentScrollTop = messageContainerRef.current?.scrollTop || 0
        const currentScrollHeight = messageContainerRef.current?.scrollHeight || 0

        if (loadMore) {
            setIsLoadingMore(true)
        } else {
            setLoading(true)
        }

        try {
            const options = {
                limit: 10,
                before: loadMore ? oldestMessageDate : new Date().toISOString()
            }
            const messages = await messageService.getDirectMessages(currentProject._id, options)
            const groupedMessages = groupMessagesByConversation(messages)

            if (loadMore) {
                setInitialLoad(false)
                setConversations(prev => {
                    const updated = [...prev]
                    groupedMessages.forEach(newConv => {
                        const existingIndex = updated.findIndex(
                            conv => conv.user._id === newConv.user._id
                        )
                        if (existingIndex >= 0) {
                            const existingMessageIds = new Set(
                                updated[existingIndex].messages.map(m => m._id)
                            )
                            const newMessages = newConv.messages.filter(
                                msg => !existingMessageIds.has(msg._id)
                            );
                            updated[existingIndex].messages = [
                                ...newMessages,
                                ...updated[existingIndex].messages
                            ]
                        }
                    })
                    return updated
                })

                setTimeout(() => {
                    if (messageContainerRef.current) {
                        const newScrollHeight = messageContainerRef.current.scrollHeight
                        messageContainerRef.current.scrollTop =
                            newScrollHeight - currentScrollHeight + currentScrollTop
                    }
                }, 0)
            } else {
                setConversations(groupedMessages)
                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView()
                }, 0)
            }

            setHasMoreMessages(messages.length === options.limit)
            if (messages.length > 0) {
                setOldestMessageDate(messages[messages.length - 1].createdAt)
            }

        } catch (error) {
            console.error('Failed to fetch direct messages:', error)
        } finally {
            if (loadMore) {
                setIsLoadingMore(false)
            } else {
                setTimeout(() => setLoading(false), 300)
            }
        }
    }

    useEffect(() => {
        setSelectedUser(null)
        loadDirectMessages()
    }, [currentProject?._id])

    useEffect(() => {
        if (location.state?.selectedUserId && conversations.length > 0) {
            const userToSelect = conversations.find(conv =>
                conv.user._id === location.state.selectedUserId
            )?.user
            if (userToSelect) {
                handleSelectUser(userToSelect);
            }
        }
    }, [location.state?.selectedUserId, conversations])

    const groupMessagesByConversation = (messages) => {
        const grouped = messages.reduce((acc, message) => {
            const otherUser = message.sender._id === currentUser._id
                ? message.recipients[0]
                : message.sender

            if (!acc[otherUser._id]) {
                acc[otherUser._id] = {
                    user: otherUser,
                    messages: []
                }
            }
            acc[otherUser._id].messages.push(message)
            return acc
        }, {})

        return Object.values(grouped).sort((a, b) => {
            const lastMessageA = a.messages[a.messages.length - 1]
            const lastMessageB = b.messages[b.messages.length - 1]
            return new Date(lastMessageB.createdAt) - new Date(lastMessageA.createdAt)
        })
    }

    const handleSelectUser = async (user) => {
        if (!user) return

        setSelectedUser(user)
        setInitialLoad(true)
        const conversation = conversations.find(conv => conv.user._id === user._id)

        if (conversation) {
            const unreadMessages = conversation.messages.filter(message =>
                message.sender._id !== currentUser._id &&
                !message.read.includes(currentUser._id)
            )

            if (unreadMessages.length > 0) {
                const unreadMessageIds = unreadMessages.map(msg => msg._id)
                await markMessagesAsRead(unreadMessageIds, currentUser._id)

                setConversations(prevConversations =>
                    prevConversations.map(conv => {
                        if (conv.user._id === user._id) {
                            return {
                                ...conv,
                                messages: conv.messages.map(msg => {
                                    if (unreadMessageIds.includes(msg._id)) {
                                        return {
                                            ...msg,
                                            read: [...new Set([...msg.read, currentUser._id])]
                                        }
                                    }
                                    return msg
                                })
                            }
                        }
                        return conv
                    })
                )
            }
        }
    }

    const handleSelectNewUser = async (user) => {
        const existingConv = conversations.find(conv => conv.user._id === user._id);
        if (!existingConv) {
            setConversations(prev => [{
                user,
                messages: []
            }, ...prev])
        }
        setSelectedUser(user)
        setShowNewMessageModal(false)
    }

    const handleNewMessage = async (content) => {
        if (!selectedUser || !currentProject?._id) return

        try {
            const newMessage = await createMessage(
                currentProject._id,
                'direct',
                content,
                [selectedUser._id]
            )

            setConversations(prev => {
                const conversationIndex = prev.findIndex(conv => conv.user._id === selectedUser._id);
                if (conversationIndex !== -1) {
                    const updatedConversation = {
                        ...prev[conversationIndex],
                        messages: [...prev[conversationIndex].messages, newMessage]
                    };
                    const newConversations = [...prev]
                    newConversations[conversationIndex] = updatedConversation
                    return newConversations
                }
                loadDirectMessages()
                return prev
            });
        } catch (error) {
            console.error('Failed to send message:', error)
            alert('Failed to send message. Please try again.')
        }
    }

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight } = e.target
        const isNearTop = scrollTop / scrollHeight < 0.2

        if (isNearTop && !isLoadingMore && hasMoreMessages) {
            loadDirectMessages(true)
        }
    }

    const hasUnreadMessages = (messages) => {
        return messages.some(message =>
            message.sender._id !== currentUser._id &&
            !message.read.includes(currentUser._id)
        )
    }

    useEffect(() => {
        initialLoad && messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [conversations, selectedUser, initialLoad])

    const renderMessages = () => {
        const conversation = conversations.find(conv => conv.user._id === selectedUser._id)
    if (!conversation) return null

    const sortedMessages = [...conversation.messages].sort((a, b) =>
        new Date(a.createdAt) - new Date(b.createdAt)
    )

    return (
        <>
            {isLoadingMore && (
                <div className={styles['loading-more']}>
                    Loading earlier messages...
                </div>
            )}

            {sortedMessages.map(message => (
                    <div
                        key={message._id}
                        className={`${styles['message']} ${
                            message.sender._id === currentUser._id
                                ? styles['sent']
                                : styles['received']
                        }`}
                    >
                        <div className={styles['message-content']}>
                            {message.content.text}
                        </div>
                        <div className={styles['message-timestamp']}>
                            {new Date(message.createdAt).toLocaleString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </>
        )
    }

    if (!currentProject) {
        return (
            <div className={styles['direct-messages-container']}>
                <div className={styles['message-info']}>
                    Please select a project first.
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className={styles['direct-messages-container']}>
                <div className={styles['loading-skeleton']}>
                    <div className={styles['skeleton-user-list']}>
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className={styles['skeleton-user-item']} />
                        ))}
                    </div>
                    <div className={styles['skeleton-chat']}>
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className={styles['skeleton-message']} />
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles['direct-messages-container']}>
            <NewMessageModal
                isOpen={showNewMessageModal}
                onClose={() => setShowNewMessageModal(false)}
                projectTeam={currentProject?.team || []}
                onSelectUser={handleSelectNewUser}
                currentUserId={currentUser?._id}
            />

            <div className={styles['users-list']}>
                <div
                    className={styles['new-message-btn']}
                    onClick={() => setShowNewMessageModal(true)}
                >
                    Start New Conversation
                </div>
                <div className={styles['users-list-content']}>
                    {conversations.map(({ user, messages }) => (
                        <div
                            key={user._id}
                            className={`${styles['user-item']} ${
                                selectedUser?._id === user._id ? styles['selected'] : ''
                            }`}
                            onClick={() => handleSelectUser(user)}
                        >
                            <div className={styles['user-info']}>
                                <div className={styles['name-container']}>
                                    <span className={styles['user-name']}>
                                        {user.firstName} {user.lastName}
                                    </span>
                                    {hasUnreadMessages(messages) && (
                                        <span className={styles['unread-indicator']} />
                                    )}
                                </div>
                                {messages.length > 0 && (
                                    <span className={styles['last-message']}>
                                        {messages[messages.length - 1].content.text.substring(0, 30)}
                                        {messages[messages.length - 1].content.text.length > 30 ? '...' : ''}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles['chat-area']}>
                {selectedUser ? (
                    <>
                        <div className={styles['chat-header']}>
                            <h3>{selectedUser.firstName} {selectedUser.lastName}</h3>
                        </div>

                        <div
                            className={styles['messages-container']}
                            ref={messageContainerRef}
                            onScroll={handleScroll}
                        >
                            {renderMessages()}
                        </div>

                        <div className={styles['composer-section']}>
                            <MessageComposer
                                onSubmit={handleNewMessage}
                                placeholder={`Message ${selectedUser.firstName}...`}
                            />
                        </div>
                    </>
                ) : (
                    <div className={styles['no-chat-selected']}>
                        Select a conversation to start messaging
                    </div>
                )}
            </div>
        </div>
    )
}

export default DirectMessages
