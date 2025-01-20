import PropTypes from 'prop-types'
import { createContext, useContext, useReducer, useCallback } from 'react'
import { useAuth } from './AuthContext'
import useMessageService from '../services/messageService'

const MessageContext = createContext(null)

const MESSAGE_ACTIONS = {
    SET_BOARD_MESSAGES: 'SET_BOARD_MESSAGES',
    ADD_MESSAGE: 'ADD_MESSAGE',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    MARK_MESSAGES_READ: 'MARK_MESSAGES_READ',
    UPDATE_MESSAGE: 'UPDATE_MESSAGE',
    DELETE_MESSAGE: 'DELETE_MESSAGE',
    SET_DIRECT_MESSAGES: 'SET_DIRECT_MESSAGES',
    APPEND_DIRECT_MESSAGES: 'APPEND_DIRECT_MESSAGES',
    SET_LOADING_MORE: 'SET_LOADING_MORE'
}

const initialState = {
    boardMessages: [],
    directMessages: {},
    loading: false,
    error: null,
    messagePages: {},
    hasMoreMessages: {},
    loadingMore: {},
    lastMessageDates: {}
}

const messageReducer = (state, action) => {
    switch (action.type) {
        case MESSAGE_ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: true,
                error: null
            }

        case MESSAGE_ACTIONS.SET_LOADING_MORE:
            return {
                ...state,
                loadingMore: {
                    ...state.loadingMore,
                    [action.payload.userId]: action.payload.isLoading
                }
            }

        case MESSAGE_ACTIONS.SET_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            }

        case MESSAGE_ACTIONS.SET_BOARD_MESSAGES:
            return {
                ...state,
                boardMessages: action.payload,
                loading: false,
                error: null
            }

        case MESSAGE_ACTIONS.SET_DIRECT_MESSAGES:
            return {
                ...state,
                directMessages: {
                    ...state.directMessages,
                    [action.payload.userId]: action.payload.messages
                },
                messagePages: {
                    ...state.messagePages,
                    [action.payload.userId]: 1
                },
                hasMoreMessages: {
                    ...state.hasMoreMessages,
                    [action.payload.userId]: action.payload.hasMore
                },
                lastMessageDates: {
                    ...state.lastMessageDates,
                    [action.payload.userId]: action.payload.oldestDate
                }
            }

        case MESSAGE_ACTIONS.APPEND_DIRECT_MESSAGES:
            return {
                ...state,
                directMessages: {
                    ...state.directMessages,
                    [action.payload.userId]: [
                        ...(state.directMessages[action.payload.userId] || []),
                        ...action.payload.messages
                    ]
                },
                messagePages: {
                    ...state.messagePages,
                    [action.payload.userId]: state.messagePages[action.payload.userId] + 1
                },
                hasMoreMessages: {
                    ...state.hasMoreMessages,
                    [action.payload.userId]: action.payload.hasMore
                },
                lastMessageDates: {
                    ...state.lastMessageDates,
                    [action.payload.userId]: action.payload.oldestDate
                }
            }

        case MESSAGE_ACTIONS.ADD_MESSAGE:
            if (action.payload.type === 'direct') {
                const userId = action.payload.recipients[0]._id
                return {
                    ...state,
                    directMessages: {
                        ...state.directMessages,
                        [userId]: [
                            action.payload,
                            ...(state.directMessages[userId] || [])
                        ]
                    }
                }
            }
            return {
                ...state,
                boardMessages: [action.payload, ...state.boardMessages]
            }

        case MESSAGE_ACTIONS.UPDATE_MESSAGE:
            if (action.payload.type === 'direct') {
                const userId = action.payload.recipients[0]._id
                return {
                    ...state,
                    directMessages: {
                        ...state.directMessages,
                        [userId]: state.directMessages[userId].map(msg =>
                            msg._id === action.payload._id
                                ? { ...action.payload, sender: msg.sender }
                                : msg
                        )
                    }
                }
            }
            return {
                ...state,
                boardMessages: state.boardMessages.map(msg =>
                    msg._id === action.payload._id
                        ? { ...action.payload, sender: msg.sender }
                        : msg
                )
            }

        case MESSAGE_ACTIONS.DELETE_MESSAGE:
            if (action.payload.type === 'direct') {
                const userId = action.payload.userId
                return {
                    ...state,
                    directMessages: {
                        ...state.directMessages,
                        [userId]: state.directMessages[userId].filter(
                            msg => msg._id !== action.payload.messageId
                        )
                    }
                }
            }
            return {
                ...state,
                boardMessages: state.boardMessages.filter(
                    msg => msg._id !== action.payload.messageId
                )
            }

        case MESSAGE_ACTIONS.MARK_MESSAGES_READ:
            const updateReadStatus = (messages) =>
                messages.map(msg =>
                    action.payload.messageIds.includes(msg._id)
                        ? { ...msg, read: [...new Set([...msg.read, action.payload.userId])] }
                        : msg
                )

            return {
                ...state,
                boardMessages: updateReadStatus(state.boardMessages),
                directMessages: Object.entries(state.directMessages).reduce((acc, [userId, messages]) => ({
                    ...acc,
                    [userId]: updateReadStatus(messages)
                }), {})
            }

        default:
            return state
    }
}

export const MessageProvider = ({ children }) => {
    const [state, dispatch] = useReducer(messageReducer, initialState)
    const messageService = useMessageService()
    const { currentUser } = useAuth()

    const PAGE_SIZE = 50

    const fetchBoardMessages = useCallback(async (projectId) => {
        dispatch({ type: MESSAGE_ACTIONS.SET_LOADING })
        try {
            const messages = await messageService.getBoardMessages(projectId)
            dispatch({
                type: MESSAGE_ACTIONS.SET_BOARD_MESSAGES,
                payload: messages
            })
        } catch (error) {
            console.error('Error fetching board messages:', error)
            dispatch({
                type: MESSAGE_ACTIONS.SET_ERROR,
                payload: 'Failed to load messages'
            })
        }
    }, [messageService])

    const fetchDirectMessages = useCallback(async (projectId, userId) => {
        if (!currentUser) {
            throw new Error('You must be logged in to view messages')
        }

        dispatch({ type: MESSAGE_ACTIONS.SET_LOADING })
        try {
            const messages = await messageService.getDirectMessages(
                projectId,
                userId,
                {
                    limit: PAGE_SIZE
                }
            )

            const oldestMessage = messages[messages.length - 1]

            dispatch({
                type: MESSAGE_ACTIONS.SET_DIRECT_MESSAGES,
                payload: {
                    userId,
                    messages,
                    hasMore: messages.length === PAGE_SIZE,
                    oldestDate: oldestMessage?.createdAt
                }
            })
        } catch (error) {
            console.error('Error fetching direct messages:', error)
            dispatch({
                type: MESSAGE_ACTIONS.SET_ERROR,
                payload: 'Failed to load messages'
            })
            throw error
        }
    }, [messageService, currentUser])

    const loadOlderMessages = useCallback(async (projectId, userId) => {
        if (!currentUser || state.loadingMore[userId]) return

        dispatch({
            type: MESSAGE_ACTIONS.SET_LOADING_MORE,
            payload: { userId, isLoading: true }
        })

        try {
            const oldestDate = state.lastMessageDates[userId]

            const olderMessages = await messageService.getDirectMessages(
                projectId,
                userId,
                {
                    limit: PAGE_SIZE,
                    before: oldestDate
                }
            )

            const oldestMessage = olderMessages[olderMessages.length - 1]

            dispatch({
                type: MESSAGE_ACTIONS.APPEND_DIRECT_MESSAGES,
                payload: {
                    userId,
                    messages: olderMessages,
                    hasMore: olderMessages.length === PAGE_SIZE,
                    oldestDate: oldestMessage?.createdAt
                }
            })
        } catch (error) {
            console.error('Error loading older messages:', error)
            dispatch({
                type: MESSAGE_ACTIONS.SET_ERROR,
                payload: 'Failed to load older messages'
            })
        } finally {
            dispatch({
                type: MESSAGE_ACTIONS.SET_LOADING_MORE,
                payload: { userId, isLoading: false }
            })
        }
    }, [messageService, currentUser, state.loadingMore, state.lastMessageDates])

    const createMessage = useCallback(async (projectId, type, content, recipients = [], parentMessage = null) => {
        if (!currentUser) {
            throw new Error('You must be logged in to create messages')
        }

        try {
            const newMessage = await messageService.createMessage(
                projectId,
                type,
                content,
                recipients,
                parentMessage
            )

            const enhancedMessage = {
                ...newMessage,
                sender: {
                    _id: currentUser._id,
                    firstName: currentUser.firstName,
                    lastName: currentUser.lastName,
                    email: currentUser.email
                }
            }

            dispatch({
                type: MESSAGE_ACTIONS.ADD_MESSAGE,
                payload: enhancedMessage
            })

            return enhancedMessage
        } catch (error) {
            console.error('Error creating message:', error)
            dispatch({
                type: MESSAGE_ACTIONS.SET_ERROR,
                payload: 'Failed to create message'
            })
            throw error
        }
    }, [messageService, currentUser])

    const editMessage = useCallback(async (messageId, content) => {
        dispatch({ type: MESSAGE_ACTIONS.SET_LOADING })
        try {
            const updatedMessage = await messageService.editMessage(messageId, content)
            dispatch({
                type: MESSAGE_ACTIONS.UPDATE_MESSAGE,
                payload: updatedMessage
            })
            return updatedMessage
        } catch (error) {
            dispatch({
                type: MESSAGE_ACTIONS.SET_ERROR,
                payload: 'Failed to edit message'
            })
            throw error
        }
    }, [messageService])

    const deleteMessage = useCallback(async (messageId, type = 'board', userId = null) => {
        dispatch({ type: MESSAGE_ACTIONS.SET_LOADING })
        try {
            await messageService.deleteMessage(messageId)
            dispatch({
                type: MESSAGE_ACTIONS.DELETE_MESSAGE,
                payload: { messageId, type, userId }
            })
        } catch (error) {
            dispatch({
                type: MESSAGE_ACTIONS.SET_ERROR,
                payload: 'Failed to delete message'
            })
            throw error
        }
    }, [messageService])

    const markMessagesAsRead = useCallback(async (messageIds) => {
        try {
            await Promise.all(
                messageIds.map(messageId =>
                    messageService.markMessageAsRead(messageId)
                )
            )

            dispatch({
                type: MESSAGE_ACTIONS.MARK_MESSAGES_READ,
                payload: {
                    messageIds,
                    userId: currentUser._id
                }
            })
        } catch (error) {
            console.error('Error marking messages as read:', error)
            dispatch({
                type: MESSAGE_ACTIONS.SET_ERROR,
                payload: 'Failed to mark messages as read'
            })
        }
    }, [messageService, currentUser?._id])

    const value = {
        boardMessages: state.boardMessages,
        directMessages: state.directMessages,
        loading: state.loading,
        error: state.error,
        hasMoreMessages: state.hasMoreMessages,
        loadingMore: state.loadingMore,
        fetchBoardMessages,
        fetchDirectMessages,
        loadOlderMessages,
        createMessage,
        editMessage,
        deleteMessage,
        markMessagesAsRead
    }

    return (
        <MessageContext.Provider value={value}>
            {children}
        </MessageContext.Provider>
    )
}

export const useMessage = () => {
    const context = useContext(MessageContext)
    if (!context) {
        throw new Error('useMessage must be used within a MessageProvider')
    }
    return context
}

MessageProvider.propTypes = {
    children: PropTypes.node.isRequired
}

export default MessageContext
