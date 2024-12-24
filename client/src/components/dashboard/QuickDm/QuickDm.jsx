// QuickDm.jsx
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useProjectContext } from '../../../context/ProjectContext';
import { useAuth } from '../../../context/AuthContext';
import { useUserContext } from '../../../context/UserContext';
import useUserDirectMessages from '../../../utils/useUserDirectMessages';
import styles from './QuickDm.module.css';

const QuickDm = ({ messageLimit = 3 }) => {
    // Context hooks
    const { currentProject } = useProjectContext();
    const { currentUser } = useAuth();
    const { getMultipleUsers } = useUserContext();

    // State management
    const [senderDetails, setSenderDetails] = useState({});
    const [markingRead, setMarkingRead] = useState({});

    // Custom hook for messages
    const {
        messages,
        loading: messagesLoading,
        error: messagesError,
        refreshMessages,
        markMessageAsRead
    } = useUserDirectMessages(currentProject?._id, currentUser?._id);

    // Fetch user details effect
    useEffect(() => {
        const fetchSenderDetails = async () => {
            if (!messages?.length) return;

            try {
                const senderIds = [...new Set(messages.map(message =>
                    typeof message.sender === 'object' ? message.sender._id : message.sender
                ))];

                const users = await getMultipleUsers(senderIds);
                const userMap = users.reduce((acc, user) => ({
                    ...acc,
                    [user._id]: user
                }), {});

                setSenderDetails(userMap);
            } catch (err) {
                console.error('Error fetching sender details:', err);
            }
        };

        fetchSenderDetails();
    }, [messages, getMultipleUsers]);

    // Handle marking message as read
    const handleMarkAsRead = async (messageId) => {
        if (markingRead[messageId]) return;

        try {
            setMarkingRead(prev => ({ ...prev, [messageId]: true }));
            await markMessageAsRead(messageId);
            await refreshMessages();
        } catch (err) {
            console.error('Error marking message as read:', err);
        } finally {
            setMarkingRead(prev => ({ ...prev, [messageId]: false }));
        }
    };

    // Render loading state
    if (messagesLoading) {
        return <div className={styles['status-message']}>Loading messages...</div>;
    }

    // Render error state
    if (messagesError) {
        return <div className={styles['status-message-error']}>{messagesError}</div>;
    }

    // Render empty state
    if (!messages?.length) {
        return <div className={styles['status-message-empty']}>No unread direct messages</div>;
    }

    // Get limited messages
    const limitedMessages = messages
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, messageLimit);

    // Render message cards
    return (
        <div className={styles['messages-list']}>
            {limitedMessages.map((message) => {
                const senderId = typeof message.sender === 'object' ? message.sender._id : message.sender;
                const sender = senderDetails[senderId] || {};
                const displayName = sender.firstName ?
                    `${sender.firstName} ${sender.lastName || ''}`.trim() :
                    sender.email || 'Unknown User';

                return (
                    <div key={message._id} className={styles['dm-message-container']}>
                        <div className={styles['dm-header']}>
                            <div className={styles['dm-user-section']}>
                                {sender.avatar && (
                                    <img
                                        src={sender.avatar}
                                        alt={displayName}
                                        className={styles['dm-avatar']}
                                    />
                                )}
                                <div className={styles['dm-author']}>{displayName}</div>
                            </div>
                            <div className={styles['dm-timestamp']}>
                                {new Date(message.createdAt).toLocaleString(undefined, {
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>

                        <div className={styles['dm-content']}>
                            <p>{message.content?.text}</p>
                        </div>

                        <button
                            className={styles['mark-read-button']}
                            onClick={() => handleMarkAsRead(message._id)}
                            disabled={markingRead[message._id]}
                        >
                            {markingRead[message._id] ? '...' : '✓'}
                        </button>
                    </div>
                );
            })}
        </div>
    );
};

QuickDm.propTypes = {
    messageLimit: PropTypes.number
};

export default QuickDm;
