import { useEffect, useMemo } from 'react';
import { useMessage } from '../../../context/MessageContext';
import { useProjectContext } from '../../../context/ProjectContext';
import { useAuth } from '../../../context/AuthContext';
import QuickBoard from './QuickBoard/QuickBoard';
import QuickDm from './QuickDm/QuickDm';
import styles from './MessageSection.module.css';

const MessageSection = () => {
    // Context hooks for accessing necessary data and functionality
    const { currentProject } = useProjectContext();
    const { currentUser } = useAuth();
    const {
        boardMessages,
        loading,
        error,
        fetchBoardMessages,
        markMessagesAsRead
    } = useMessage();

    // Effect to fetch messages when project changes
    useEffect(() => {
        if (currentProject?._id) {
            fetchBoardMessages(currentProject._id);
        }
    }, [currentProject?._id]);

    // Filter unread board messages
    const unreadBoardMessages = useMemo(() => {
        if (!boardMessages || !currentUser) return [];

        return boardMessages
            .filter(message => (
                // Only get parent messages (not replies)
                !message.parentMessage &&
                // Check if current user hasn't read it
                !message.read.includes(currentUser._id)
            ))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3); // Only get the last 3
    }, [boardMessages, currentUser]);

    if (loading) {
        return <div className={styles.loading}>Loading messages...</div>;
    }

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    return (
        <div className={styles.messageSection}>
            <div className={styles.content}>
                <QuickBoard
                    messages={unreadBoardMessages}
                    onMarkAsRead={markMessagesAsRead}
                />
                <QuickDm />
            </div>
        </div>
    );
};

export default MessageSection;
