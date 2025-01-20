import PropTypes from 'prop-types'
import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import styles from './MessageComposer.module.css'

const MessageComposer = ({
    onSubmit,
    replyingTo,
    onCancelReply,
    placeholder = "Type a message..."
}) => {
    const [content, setContent] = useState('')
    const textareaRef = useRef(null)

    useEffect(() => {
        if (replyingTo && textareaRef.current) {
            textareaRef.current.focus()
        }
    }, [replyingTo])

    const handleTextareaChange = (e) => {
        const textarea = e.target
        setContent(textarea.value)

        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
    };

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!content.trim()) return

        onSubmit(content)
        setContent('')

        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleSubmit(e)
        }
    }

    return (
        <div className={styles['composer-container']}>
            {replyingTo && (
                <div className={styles['reply-indicator']}>
                    <span>Replying to thread</span>
                    <button
                        onClick={onCancelReply}
                        className={styles['cancel-reply']}
                        aria-label="Cancel reply"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles['composer-form']}>
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={handleTextareaChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className={styles['composer-input']}
                    rows={1}
                />

                <div className={styles['composer-actions']}>
                    <span className={styles['shortcut-hint']}>
                        Press Ctrl + Enter to send
                    </span>
                    <button
                        type="submit"
                        className={styles['send-button']}
                        disabled={!content.trim()}
                    >
                        Send
                    </button>
                </div>
            </form>
        </div>
    )
}

export default MessageComposer

MessageComposer.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    replyingTo: PropTypes.string,
    onCancelReply: PropTypes.func,
    placeholder: PropTypes.string
}
