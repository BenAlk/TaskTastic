import { useState, useEffect } from 'react';
import { useMessage } from '../../../context/MessageContext';
import { useProjectContext } from '../../../context/ProjectContext';
import MessageComposer from '../MessageComposer/MessageComposer';
import BoardMessage from '../BoardMessage/BoardMessage';
import styles from './QuickBoard.module.css';

const QuickBoard = () => {
    // State Management:
    // Think of these like different lists we need to keep track of
    const [replyingTo, setReplyingTo] = useState(null);        // Which message we're replying to
    const [expandedThreads, setExpandedThreads] = useState(new Set());  // Which conversations are open
    const [loading, setLoading] = useState(true);              // Are we loading messages?
    const [deletedMessages, setDeletedMessages] = useState(new Set()); // Keep track of what's been deleted

    // Get our tools from React contexts
    // Like getting our supplies from different toolboxes
    const { currentProject } = useProjectContext();
    const {
        createMessage,
        fetchBoardMessages,
        boardMessages = [], // If no messages, start with empty array
        error
    } = useMessage();

    // When the project changes, load its messages
    // Like opening a new file folder and reading its contents
    useEffect(() => {
        if (!currentProject?._id) return;

        const loadMessages = async () => {
            setLoading(true);
            try {
                await fetchBoardMessages(currentProject._id);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            } finally {
                // Wait a bit before hiding loading screen to prevent flickering
                setTimeout(() => setLoading(false), 300);
            }
        };

        loadMessages();
        setExpandedThreads(new Set()); // Reset which threads are expanded
    }, [currentProject?._id]);

    // When someone sends a new message
    // Like adding a new note to our conversation
    const handleNewMessage = async (content) => {
        if (!currentProject?._id) return;

        try {
            await createMessage(
                currentProject._id,
                'board',
                content,
                [],
                replyingTo
            );
            setReplyingTo(null); // Clear reply state after posting
        } catch (error) {
            console.error('Failed to create message:', error);
            alert('Failed to create message. Please try again.');
        }
    };

    // Handle when a message is successfully deleted
    // Like crossing something off our list
    const handleMessageDeleted = (messageId) => {
        setDeletedMessages(prev => new Set([...prev, messageId]));
    };

    // Organize messages into conversations (threads)
    // Like sorting papers into different folders
    const organizeThreads = (messages) => {
        // First, remove any messages that have been deleted
        const activeMessages = messages.filter(msg => !deletedMessages.has(msg._id));

        return activeMessages.reduce((acc, message) => {
            if (!message.parentMessage) {
                // This is a new conversation starter
                if (!acc[message._id]) {
                    acc[message._id] = {
                        root: message,
                        hasReplies: false,
                        replies: []
                    };
                } else {
                    // We found replies before the main message
                    acc[message._id].root = message;
                }
            } else {
                // This is a reply to another message
                const parentId = message.parentMessage;
                if (!acc[parentId]) {
                    // Haven't seen the parent message yet
                    acc[parentId] = {
                        root: null,
                        hasReplies: true,
                        replies: [message]
                    };
                } else {
                    // Add to existing conversation
                    acc[parentId].hasReplies = true;
                    acc[parentId].replies.push(message);
                }
            }
            return acc;
        }, {});
    };

    // Toggle showing/hiding replies in a thread
    // Like expanding or collapsing a folder
    const toggleThread = (threadId) => {
        setExpandedThreads(prev => {
            const newSet = new Set(prev);
            if (newSet.has(threadId)) {
                newSet.delete(threadId);
            } else {
                newSet.add(threadId);
            }
            return newSet;
        });
    };

    // Different screens based on our current state
    if (!currentProject) {
        return (
            <div className={styles['quickboard-container']}>
                <div className={styles['message-info']}>
                    Please select a project first.
                </div>
            </div>
        );
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
        );
    }

    if (error) {
        return (
            <div className={styles['quickboard-container']}>
                <div className={styles['message-error']}>
                    Error: {error}
                </div>
            </div>
        );
    }

    // Organize all our messages into threads
    const threadedMessages = organizeThreads(boardMessages);

    // The main display
    return (
        <div className={styles['quickboard-container']}>
            {/* Area for writing new messages */}
            <div className={styles['composer-section']}>
                <MessageComposer
                    onSubmit={handleNewMessage}
                    replyingTo={replyingTo}
                    onCancelReply={() => setReplyingTo(null)}
                    placeholder="Share something with your team..."
                />
            </div>

            {/* Area showing all messages */}
            <div className={styles['messages-section']}>
                {Object.entries(threadedMessages)
                    // Only show threads that have a main message
                    .filter(([_, thread]) => thread.root)
                    // Sort by date, newest first
                    .sort(([_, a], [__, b]) =>
                        new Date(b.root.createdAt) - new Date(a.root.createdAt)
                    )
                    .map(([threadId, thread]) => {
                        const isExpanded = expandedThreads.has(threadId);

                        return (
                            <div key={threadId} className={styles['message-thread']}>
                                {/* The main message of the thread */}
                                <div className={styles['thread-header']}>
                                    <BoardMessage
                                        message={thread.root}
                                        hasReplies={thread.hasReplies}
                                        onReply={() => setReplyingTo(thread.root._id)}
                                        onDeleteSuccess={handleMessageDeleted}
                                    />

                                    {/* Button to show/hide replies */}
                                    {thread.replies.length > 0 && (
                                        <button
                                            onClick={() => toggleThread(threadId)}
                                            className={styles['toggle-thread-button']}
                                        >
                                            {isExpanded ?
                                                'Hide replies' :
                                                `Show ${thread.replies.length} ${
                                                    thread.replies.length === 1 ? 'reply' : 'replies'
                                                }`
                                            }
                                        </button>
                                    )}
                                </div>

                                {/* The replies, shown when expanded */}
                                {thread.replies.length > 0 && isExpanded && (
                                    <div className={styles['thread-replies']}>
                                        {thread.replies
                                            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                                            .map(reply => (
                                                <BoardMessage
                                                    key={reply._id}
                                                    message={reply}
                                                    hasReplies={false}
                                                    isReply={true}
                                                    onReply={() => setReplyingTo(thread.root._id)}
                                                    onDeleteSuccess={handleMessageDeleted}
                                                />
                                            ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

export default QuickBoard;
