import { useState, useEffect, useRef } from 'react';
import { useMessage } from '../../../context/MessageContext';
import useMessageService from '../../../services/messageService';
import { useProjectContext } from '../../../context/ProjectContext';
import { useAuth } from '../../../context/AuthContext';
import MessageComposer from '../MessageComposer/MessageComposer';
import NewMessageModal from '../NewMessageModal/NewMessageModal';

import styles from './DirectMessages.module.css';

const DirectMessages = () => {
    const messagesEndRef = useRef(null);
    // State Management
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [conversations, setConversations] = useState([]);
    const [showNewMessageModal, setShowNewMessageModal] = useState(false);

    // Context and Services
    const { currentProject } = useProjectContext();
    const { currentUser } = useAuth();
    const { createMessage, markMessagesAsRead } = useMessage();
    const messageService = useMessageService();

    // Load Initial Messages
    const loadDirectMessages = async () => {
        if (!currentProject?._id) return;

        setLoading(true);
        try {
            const messages = await messageService.getDirectMessages(currentProject._id);
            const groupedMessages = groupMessagesByConversation(messages);
            setConversations(groupedMessages);
        } catch (error) {
            console.error('Failed to fetch direct messages:', error);
        } finally {
            setTimeout(() => setLoading(false), 300);
        }
    };

    useEffect(() => {
        loadDirectMessages();
    }, [currentProject?._id]);

    // Message Grouping and Sorting
    const groupMessagesByConversation = (messages) => {
        const grouped = messages.reduce((acc, message) => {
            const otherUser = message.sender._id === currentUser._id
                ? message.recipients[0]
                : message.sender;

            if (!acc[otherUser._id]) {
                acc[otherUser._id] = {
                    user: otherUser,
                    messages: []
                };
            }
            acc[otherUser._id].messages.push(message);
            return acc;
        }, {});

        // Sort conversations by most recent message
        return Object.values(grouped).sort((a, b) => {
            const lastMessageA = a.messages[a.messages.length - 1];
            const lastMessageB = b.messages[b.messages.length - 1];
            return new Date(lastMessageB.createdAt) - new Date(lastMessageA.createdAt);
        });
    };

    // Message Handling Functions
    const handleSelectUser = async (user) => {
        setSelectedUser(user);

        // Find the conversation with this user
        const conversation = conversations.find(conv => conv.user._id === user._id);

        if (conversation) {
            // Get unread messages from this user
            const unreadMessages = conversation.messages.filter(message =>
                message.sender._id !== currentUser._id && // Message is from other user
                !message.read.includes(currentUser._id)   // Current user hasn't read it
            );

            // Mark unread messages as read
            if (unreadMessages.length > 0) {
                const unreadMessageIds = unreadMessages.map(msg => msg._id);
                await markMessagesAsRead(unreadMessageIds, currentUser._id);

                // Update local conversation state
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
                                        };
                                    }
                                    return msg;
                                })
                            };
                        }
                        return conv;
                    })
                );
            }
        }
    };

    const handleSelectNewUser = async (user) => {
        // Check if conversation already exists
        const existingConv = conversations.find(conv => conv.user._id === user._id);
        if (!existingConv) {
            // Create a new conversation entry with empty messages array
            setConversations(prev => [{
                user,
                messages: []
            }, ...prev]);
        }
        setSelectedUser(user);
    };

    const handleNewMessage = async (content) => {
        if (!selectedUser || !currentProject?._id) return;

        try {
            const newMessage = await createMessage(
                currentProject._id,
                'direct',
                content,
                [selectedUser._id]
            );

            // Update the conversations state locally
            setConversations(prev => {
                const conversationIndex = prev.findIndex(conv => conv.user._id === selectedUser._id);
                if (conversationIndex !== -1) {
                    const updatedConversation = {
                        ...prev[conversationIndex],
                        messages: [...prev[conversationIndex].messages, newMessage]
                    };
                    const newConversations = [...prev];
                    newConversations[conversationIndex] = updatedConversation;
                    return newConversations;
                }
                // If somehow we don't have the conversation, reload all messages
                loadDirectMessages();
                return prev;
            });
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Failed to send message. Please try again.');
        }
    };

    // Helper Functions
    const hasUnreadMessages = (messages) => {
        return messages.some(message =>
            message.sender._id !== currentUser._id && // Message is from other user
            !message.read.includes(currentUser._id)   // Current user hasn't read it
        );
    };

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    },[conversations, selectedUser]);

    const renderMessages = () => {
        const conversation = conversations.find(conv => conv.user._id === selectedUser._id);
        if (!conversation) return null;

        // Sort messages by timestamp (oldest to newest)
        const sortedMessages = [...conversation.messages].sort((a, b) =>
            new Date(a.createdAt) - new Date(b.createdAt)
        );

        return sortedMessages.map(message => (
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
        ));
    };

    // Loading and Project Check
    if (!currentProject) {
        return (
            <div className={styles['direct-messages-container']}>
                <div className={styles['message-info']}>
                    Please select a project first.
                </div>
            </div>
        );
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
        );
    }

    // Main Render
    return (
        <div className={styles['direct-messages-container']}>
            <NewMessageModal
                isOpen={showNewMessageModal}
                onClose={() => setShowNewMessageModal(false)}
                projectTeam={currentProject?.team || []}
                onSelectUser={handleSelectNewUser}
                currentUserId={currentUser?._id}
            />

            {/* Users List */}
            <div className={styles['users-list']}>
                <div
                    className={styles['new-message-btn']}
                    onClick={() => setShowNewMessageModal(true)}
                >
                    Start New Conversation
                </div>
                <div className={styles['users-list-content']}>
                    {conversations.map(({ user, messages }) => {
                        const lastMessage = messages[0];
                        return (
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
                                    {lastMessage ? (
                                        <span className={styles['last-message']}>
                                            {lastMessage.content.text.substring(0, 30)}
                                            {lastMessage.content.text.length > 30 ? '...' : ''}
                                        </span>
                                    ) : (
                                        <span className={styles['last-message']}>
                                            No messages yet
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Chat Area */}
            <div className={styles['chat-area']}>
                {selectedUser ? (
                    <>
                        <div className={styles['chat-header']}>
                            <h3>{selectedUser.firstName} {selectedUser.lastName}</h3>
                        </div>

                        <div className={styles['messages-container']}>
                            {renderMessages()}
                            <div ref={messagesEndRef} />
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
    );
};

export default DirectMessages;
