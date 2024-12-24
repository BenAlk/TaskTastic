import { useState, useEffect, useMemo } from 'react';
import { useUserContext } from '../../../../context/UserContext';
import { useMessage } from '../../../../context/MessageContext';
import useMessageService from '../../../../services/messageService';
import { useProjectContext } from '../../../../context/ProjectContext';
import { useAuth } from '../../../../context/AuthContext';
import { MessageSquare } from 'lucide-react';
import styles from './QuickDm.module.css';

    /* eslint react/prop-types: 0 */


// ConversationPreview remains mostly the same, but with improved error handling
const ConversationPreview = ({ conversation }) => {
    const { getUserDetails } = useUserContext();
    const { currentUser } = useAuth();
    const [otherUser, setOtherUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadOtherUser = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const otherUserId = conversation.participants.find(
                    id => id && typeof id === 'string' && id !== currentUser?._id
                );

                if (!otherUserId) {
                    throw new Error('No valid other user ID found');
                }

                const userData = await getUserDetails(otherUserId);
                if (!userData) {
                    throw new Error('User data not found');
                }

                setOtherUser(userData);
            } catch (error) {
                console.error('Error loading user:', error);
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadOtherUser();
    }, [conversation.participants, currentUser?._id]);

    if (error) {
        return <div className={styles['error-state']}>Error: {error}</div>;
    }

    return (
        <div className={styles['conversation-wrapper']}>
            {isLoading ? (
                <span className={styles['loading-shimmer']}>Loading...</span>
            ) : (
                otherUser && (
                    <div className={styles['conversation-preview']}>
                        <div className={styles['user-section']}>
                            <div className={styles['avatar']}>
                                {`${otherUser.firstName?.[0] || ''}${otherUser.lastName?.[0] || ''}`}
                            </div>
                            <span className={styles['user-name']}>
                                {`${otherUser.firstName || ''} ${otherUser.lastName || ''}`}
                            </span>
                        </div>
                        <div className={styles['separator']} />
                        <div className={styles['message-section']}>
                            <MessageSquare className={styles['message-icon']} />
                            {conversation.unreadCount > 0 && (
                                <span className={styles['unread-badge']}>
                                    {conversation.unreadCount}
                                </span>
                            )}
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

// Main QuickDm component
const QuickDm = () => {
    const { loading, error } = useMessage();
    const { currentUser } = useAuth();
    const { currentProject } = useProjectContext();
    const messageService = useMessageService();
    const [conversations, setConversations] = useState([]);

    // Derive unread conversations using useMemo for performance
    const unreadConversations = useMemo(() => {
        return conversations.filter(conversation => conversation.unreadCount > 0);
    }, [conversations]);

    useEffect(() => {
        const fetchConversations = async () => {
            if (!currentProject?._id) return;

            try {
                const response = await messageService.getDashboardMessages(currentProject._id);
                const messages = response?.directMessages || [];

                if (messages.length === 0) {
                    setConversations([]);
                    return;
                }

                // Group messages by conversation participants
                const conversationMap = messages.reduce((acc, message) => {
                    // Validate message structure
                    if (!message?.sender || !Array.isArray(message?.recipients)) {
                        console.warn('Invalid message structure:', message);
                        return acc;
                    }

                    // Create unique conversation ID by sorting participant IDs
                    const participants = [message.sender._id, ...message.recipients.map(r => r._id)]
                        .filter(Boolean)
                        .sort()
                        .join('-');

                    // Initialize or update conversation in accumulator
                    if (!acc[participants]) {
                        acc[participants] = {
                            participants: [message.sender._id, ...message.recipients.map(r => r._id)]
                                .filter(Boolean),
                            unreadCount: 0,
                            lastMessage: message
                        };
                    }

                    // Count unread messages for current user
                    if (!message.read?.includes(currentUser?._id)) {
                        acc[participants].unreadCount++;
                    }

                    // Update last message if current message is newer
                    if (new Date(message.createdAt) > new Date(acc[participants].lastMessage.createdAt)) {
                        acc[participants].lastMessage = message;
                    }

                    return acc;
                }, {});

                // Convert map to array and sort by last message date
                const sortedConversations = Object.values(conversationMap)
                    .sort((a, b) =>
                        new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
                    );

                setConversations(sortedConversations);
            } catch (error) {
                console.error('Error fetching DMs:', error);
            }
        };

        fetchConversations();
    }, [currentProject?._id, currentUser?._id]);

    if (loading) {
        return (
            <div className={styles['quickdm']}>
                <h3 className={styles['section-title']}>Direct Messages</h3>
                <div className={styles['loading']}>Loading conversations...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles['quickdm']}>
                <h3 className={styles['section-title']}>Direct Messages</h3>
                <div className={styles['error']}>{error}</div>
            </div>
        );
    }

    return (
        <div className={styles['quickdm']}>
            <h3 className={styles['section-title']}>Direct Messages</h3>
            <div className={styles['conversation-container']}>
                {unreadConversations.length === 0 ? (
                    <div className={styles['no-messages']}>
                        No unread messages
                    </div>
                ) : (
                    unreadConversations.map(conversation => (
                        <ConversationPreview
                            key={conversation.participants.join('-')}
                            conversation={conversation}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default QuickDm
