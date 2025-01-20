import PropTypes from 'prop-types'
import { useState } from 'react'
import { format } from 'date-fns'
import { useMessage } from '../../../context/MessageContext'
import { useAuth } from '../../../context/AuthContext'
import { MessageSquare, ThumbsUp, Edit2, Trash2 } from 'lucide-react'
import styles from './BoardMessage.module.css'

const BoardMessage = ({ message, hasReplies, isReply = false, onReply, onDeleteSuccess }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editContent, setEditContent] = useState(message.content.text)
    const { currentUser } = useAuth()
    const isReplyMessage = Boolean(message.parentMessage)

    const { editMessage, deleteMessage, addReaction } = useMessage()

    const getUserDisplayName = (user) => {
        if (!user) return 'Unknown User'
        if (typeof user === 'string') return 'Loading...'
        return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown User'
    }

    const handleEdit = async () => {
        try {
            await editMessage(message._id, editContent)
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to edit message:', error)
            alert('Failed to edit message. Please try again.')
        }
    };

    const handleDelete = async () => {
        if (isReplyMessage) {
            alert("Replies cannot be deleted. Please delete the entire thread if needed.")
            return
        }

        if (hasReplies) {
            alert("Cannot delete a message that has replies. Please delete the replies first.")
            return
        }

        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                await deleteMessage(message._id)
                onDeleteSuccess?.(message._id)
            } catch (error) {
                if (error?.response?.status === 400) {
                    alert(error.response.data.message || "Cannot delete this message")
                } else if (error?.response?.status === 403) {
                    alert("You don't have permission to delete this message")
                } else {
                    alert("Failed to delete message. Please try again.")
                    console.error('Failed to delete message:', error)
                }
            }
        }
    }

    const handleReaction = async () => {
        try {
            await addReaction(message._id, '👍')
        } catch (error) {
            console.error('Failed to add reaction:', error)
            alert('Failed to add reaction. Please try again.')
        }
    }

    if (message.status === 'deleted') {
        return (
            <div className={`${styles.message} ${styles.deleted}`}>
                <p>This message has been deleted</p>
            </div>
        )
    }

    return (
        <div className={`${styles.message} ${isReply ? styles.reply : ''}`}>
            {/* Message Header */}
            <div className={styles['message-header']}>
                <div className={styles['user-info']}>
                    <span className={styles['user-name']}>
                        {getUserDisplayName(message.sender)}
                    </span>
                    <span className={styles['timestamp']}>
                        {format(new Date(message.createdAt), 'MMM d, h:mm a')}
                    </span>
                </div>
                {message.status === 'edited' && (
                    <span className={styles['edited-indicator']}>
                        (edited)
                    </span>
                )}
            </div>

            <div className={styles['message-content']}>
                {isEditing ? (
                    <div className={styles['edit-container']}>
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className={styles['edit-input']}
                        />
                        <div className={styles['edit-actions']}>
                            <button
                                onClick={handleEdit}
                                className={styles['save-btn']}
                            >
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setEditContent(message.content.text);
                                }}
                                className={styles['cancel-btn']}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>{message.content.text}</p>
                )}
            </div>

            <div className={styles['message-actions']}>
                <button
                    onClick={onReply}
                    className={styles['action-btn']}
                    title="Reply to this message"
                >
                    <MessageSquare className={styles['action-icon']} />
                    Reply
                </button>

                <button
                    onClick={handleReaction}
                    className={styles['action-btn']}
                    title="Like this message"
                >
                    <ThumbsUp className={styles['action-icon']} />
                    {message.metadata?.reactions?.length || 0}
                </button>

                {message.sender._id === currentUser?._id && (
                    <>
                        <button
                            onClick={() => setIsEditing(true)}
                            className={styles['action-btn']}
                            title="Edit message"
                        >
                            <Edit2 className={styles['action-icon']} />
                            Edit
                        </button>

                        <button
                            onClick={handleDelete}
                            className={`${styles['action-btn']} ${styles.delete} ${hasReplies || isReplyMessage  ? styles.disabled : ''}`}
                            title={hasReplies || isReplyMessage ? "Cannot delete messages with replies, or replies to messages." : "Delete message"}
                            disabled={hasReplies}
                        >
                            <Trash2 className={styles['action-icon']} />
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    )
}

BoardMessage.propTypes = {
    message: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        parentMessage: PropTypes.string,
        sender: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.shape({
                _id: PropTypes.string.isRequired,
                email: PropTypes.string.isRequired,
                firstName: PropTypes.string,
                lastName: PropTypes.string
            })
        ]).isRequired,
        content: PropTypes.shape({
            text: PropTypes.string.isRequired,
            mentions: PropTypes.arrayOf(PropTypes.shape({
                user: PropTypes.string,
                position: PropTypes.number
            }))
        }).isRequired,
        status: PropTypes.oneOf(['sent', 'delivered', 'edited', 'deleted']),
        metadata: PropTypes.shape({
            reactions: PropTypes.arrayOf(PropTypes.shape({
                user: PropTypes.oneOfType([
                    PropTypes.string,
                    PropTypes.object
                ]),
                emoji: PropTypes.string
            }))
        }),
        createdAt: PropTypes.string.isRequired
    }).isRequired,
    hasReplies: PropTypes.bool.isRequired,
    isReply: PropTypes.bool,
    onReply: PropTypes.func.isRequired,
    onDeleteSuccess: PropTypes.func
}

export default BoardMessage
