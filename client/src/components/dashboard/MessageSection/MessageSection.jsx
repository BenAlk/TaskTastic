import { useEffect, useMemo } from 'react'
import { useMessage } from '../../../context/MessageContext'
import { useProjectContext } from '../../../context/ProjectContext'
import { useAuth } from '../../../context/AuthContext'
import Quickboard from '../QuickBoard/QuickBoard'
import QuickDm from '../QuickDm/QuickDm'
import styles from './MessageSection.module.css'

const MessageSection = () => {
    const { currentProject } = useProjectContext()
    const { currentUser } = useAuth()
    const {
        boardMessages,
        loading,
        error,
        fetchBoardMessages,
        markMessagesAsRead
    } = useMessage()

    useEffect(() => {
        if (currentProject?._id) {
            fetchBoardMessages(currentProject._id)
        }
    }, [currentProject?._id])

    const unreadBoardMessages = useMemo(() => {
        if (!boardMessages || !currentUser) return []

        return boardMessages
            .filter(message => (
                !message.parentMessage &&
                !message.read.includes(currentUser._id)
            ))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 3)
    }, [boardMessages, currentUser])

    if (loading) {
        return <div className={styles.loading}>Loading messages...</div>
    }

    if (error) {
        return <div className={styles.error}>{error}</div>
    }

    return (
        <div className={styles.messageSection}>
            <div className={styles.content}>
                <Quickboard
                    messages={unreadBoardMessages}
                    onMarkAsRead={markMessagesAsRead}
                />
                <QuickDm />
            </div>
        </div>
    )
}

export default MessageSection
