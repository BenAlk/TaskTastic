// QuickBoard.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useProjectContext } from "../../../context/ProjectContext";
import { useAuth } from "../../../context/AuthContext";
import useMessageService from "../../../services/messageService";
import useUserService from "../../../services/usersService";
import { ImportantIcon } from "../../../assets/icons";
import styles from "./QuickBoard.module.css";

const QuickBoard = ({ messageLimit = 3 }) => {
    // Context and services initialization
    const { currentProject } = useProjectContext();
    const { currentUser } = useAuth();
    const messageService = useMessageService();
    const userService = useUserService();

    // State management
    const [messages, setMessages] = useState([]);
    const [senderDetails, setSenderDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [markingRead, setMarkingRead] = useState({});

    // Fetch messages effect
    useEffect(() => {
        const fetchBoardMessages = async () => {
            if (!currentProject?._id) return;

            try {
                setLoading(true);
                const boardMessages = await messageService.getBoardMessages(currentProject._id);

                // Filter unread messages, sort by date, and limit quantity
                const unreadMessages = boardMessages
                    .filter(msg => !msg.read.includes(currentUser?._id))
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, messageLimit);

                setMessages(unreadMessages);
                setError(null);
            } catch (err) {
                console.error('Error fetching board messages:', err);
                setError('Unable to load board messages');
            } finally {
                setLoading(false);
            }
        };

        fetchBoardMessages();
    }, [currentProject?._id, currentUser?._id, messageLimit]);

    // Fetch user details effect
    useEffect(() => {
        const fetchSenderDetails = async () => {
            if (!messages?.length) return;

            try {
                const senderIds = [...new Set(messages.map(message => message.sender))];
                const users = await userService.fetchMultipleUsers(senderIds);

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
    }, [messages]);

    // Handle marking a message as read
    const handleAcknowledgeMessage = async (messageId) => {
        if (markingRead[messageId]) return;

        try {
            setMarkingRead(prev => ({ ...prev, [messageId]: true }));
            await messageService.markMessageAsRead(messageId);

            setMessages(prevMessages =>
                prevMessages.filter(msg => msg._id !== messageId)
            );
        } catch (err) {
            console.error('Error marking message as read:', err);
        } finally {
            setMarkingRead(prev => ({ ...prev, [messageId]: false }));
        }
    };

    // Render loading state
    if (loading) {
        return <div className={styles['status-message']}>Loading board messages...</div>;
    }

    // Render error state
    if (error) {
        return <div className={styles['status-message-error']}>{error}</div>;
    }

    // Render empty state
    if (!messages?.length) {
        return <div className={styles['status-message-empty']}>No unread board messages</div>;
    }

    // Render message cards
    return (
        <div className={styles['messages-list']}>
            {messages.map((message) => {
                const sender = senderDetails[message.sender] || {};
                const displayName = sender.firstName ?
                    `${sender.firstName} ${sender.lastName}`.trim() :
                    sender.email || 'Unknown User';

                return (
                    <div key={message._id} className={styles['message-container']}>
                        <div className={styles['message-header']}>
                            <div className={styles['message-author']}>{displayName}</div>
                            <div className={styles['message-timestamp']}>
                                {new Date(message.createdAt).toLocaleString(undefined, {
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </div>
                        </div>

                        <div className={styles['message-content']}>
                            <p>{message.content?.text}</p>
                        </div>

                        <div className={styles['message-footer']}>
                            {message.metadata?.priority === 'urgent' && (
                                <div className={styles['important-icon']}>
                                    <ImportantIcon height="15px" width="15px" />
                                </div>
                            )}
                            <button
                                className={styles['acknowledge-button']}
                                onClick={() => handleAcknowledgeMessage(message._id)}
                                disabled={markingRead[message._id]}
                            >
                                {markingRead[message._id] ? '...' : '✓'}
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

QuickBoard.propTypes = {
    messageLimit: PropTypes.number
};

export default QuickBoard;
