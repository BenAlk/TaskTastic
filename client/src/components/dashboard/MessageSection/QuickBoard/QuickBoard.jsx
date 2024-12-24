import PropTypes from "prop-types"
import { useState, useEffect, useMemo } from 'react';
import { useUserContext } from '../../../../context/UserContext';
import { useMessage } from '../../../../context/MessageContext';
import { CheckCircle } from 'lucide-react';
import styles from "./QuickBoard.module.css"    /* eslint react/prop-types: 0 */

// MessagePreview is a child component that handles individual message display
const MessagePreview = ({ message, onMarkAsRead, boardMessages }) => {
    const { getUserDetails } = useUserContext();
    const [sender, setSender] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    console.log(message)

    // Load user data when the message loads or changes
    useEffect(() => {
        const loadSender = async () => {
            setIsLoading(true);
            try {
                // Check if sender is already an object with the required fields
                if (message.sender && typeof message.sender === 'object' && message.sender.firstName) {
                    setSender(message.sender);
                    setIsLoading(false);
                    return;
                }

                // If sender is an ID, fetch the user details
                if (typeof message.sender === 'string') {
                    const user = await getUserDetails(message.sender);
                    setSender(user);
                }
            } catch (error) {
                console.error('Error loading user:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadSender();
    }, [message.sender]);

    // Calculate number of replies for this message
    const replyCount = useMemo(() => {
        return boardMessages?.filter(msg =>
            msg.parentMessage === message._id
        ).length ?? 0;
    }, [message._id, boardMessages]);

    // Format the time to be user-friendly
    const formattedDate = useMemo(() => {
        const messageDate = new Date(message.createdAt);
        const now = new Date();
        const diffHours = (now - messageDate) / (1000 * 60 * 60);

        if (diffHours < 24) {
            return `${Math.floor(diffHours)}h ago`;
        } else if (diffHours < 48) {
            return 'yesterday';
        } else {
            return messageDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    }, [message.createdAt]);

    // Handle clicking the "mark as read" button
    const handleMarkAsRead = (e) => {
        e.stopPropagation();
        onMarkAsRead([message._id]);
    };

    // Handle clicking the message preview
    const handleMessageClick = () => {
        console.log('Navigate to message:', message._id);
    };

    return (
        <div className={styles['message-container']}>
            <div
                className={styles['message-preview']}
                onClick={handleMessageClick}
                role="button"
                tabIndex={0}
            >
                <div className={styles['user-info']}>
                    <div className={styles['user-avatar']}>{`${sender?.firstName[0]}${sender?.lastName[0]}`}</div>
                    <div className={styles['user-details']}>
                        {isLoading ? (
                            <span className={styles['loading-shimmer']}>Loading...</span>
                        ) : (
                            sender && (
                                <div className={styles['user-name']}>
                                    {`${sender?.firstName} ${sender?.lastName}`}
                                </div>
                            )
                        )}
                        <div className={styles['message-date']}>
                            {formattedDate}
                        </div>
                    </div>
                </div>

                <div className={styles['message-content']}>
                    {message.content.text.length > 75
                        ? `${message.content.text.substring(0, 75)}...`
                        : message.content.text}
                </div>

                <div className={styles['message-footer']}>
                    <div className={styles['reply-count']}>
                        {replyCount} {replyCount === 1 ? 'reply' : 'replies'}
                    </div>
                    <button
                        onClick={handleMarkAsRead}
                        className={styles['read-button']}
                        aria-label="Mark as read"
                    >
                        <CheckCircle className={styles['check-icon']} />
                    </button>
                </div>
            </div>
        </div>
    );
};


// Main Quickboard component that manages the list of messages
const QuickBoard = ({ messages, onMarkAsRead }) => {
    const { boardMessages } = useMessage();

    if (!messages?.length) {
        return (
            <div className={styles['quickboard']}>
                <h3 className={styles['section-title']}>Board Messages</h3>
                <div className={styles['empty-message-container']}>
                    <div className={styles['no-messages']}>
                        No unread messages
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles['quickboard']}>
            <h3 className={styles['section-title']}>Board Messages</h3>
            <div className={styles['message-wrapper']}>
                {messages.map(message => (
                    <MessagePreview
                        key={message._id}
                        message={message}
                        onMarkAsRead={onMarkAsRead}
                        boardMessages={boardMessages}
                    />
                ))}
            </div>
        </div>
    );
};

QuickBoard.propTypes = {
    messages: PropTypes.arrayOf(PropTypes.shape({
        _id: PropTypes.string.isRequired,
        content: PropTypes.shape({
            text: PropTypes.string.isRequired
        }).isRequired,
        createdAt: PropTypes.string.isRequired,
        sender: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                _id: PropTypes.string,
                firstName: PropTypes.string,
                lastName: PropTypes.string,
                email: PropTypes.string
            })
        ]).isRequired,
        parentMessage: PropTypes.string
    })),
    onMarkAsRead: PropTypes.func.isRequired
};

export default QuickBoard;
