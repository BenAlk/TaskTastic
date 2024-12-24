import PropTypes from 'prop-types'
import { createContext, useContext, useReducer, useCallback } from 'react';
import { useAuth } from './AuthContext';
import useMessageService from '../services/messageService';

// Create a new context for messages
const MessageContext = createContext(null);

// Define all possible actions our reducer can handle
const MESSAGE_ACTIONS = {
    SET_BOARD_MESSAGES: 'SET_BOARD_MESSAGES',
    ADD_MESSAGE: 'ADD_MESSAGE',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    MARK_MESSAGES_READ: 'MARK_MESSAGES_READ'
};

// Set up initial state for our messages
const initialState = {
    boardMessages: [],    // Array to store all board messages
    loading: false,       // Track loading state
    error: null          // Store any errors that occur
};

// Our reducer function to handle state updates
const messageReducer = (state, action) => {
    switch (action.type) {
        case MESSAGE_ACTIONS.SET_LOADING:
            return {
                ...state,
                loading: true,
                error: null
            };

        case MESSAGE_ACTIONS.SET_ERROR:
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        case MESSAGE_ACTIONS.SET_BOARD_MESSAGES:
            return {
                ...state,
                boardMessages: action.payload,
                loading: false,
                error: null
            };

        case MESSAGE_ACTIONS.ADD_MESSAGE:
            return {
                ...state,
                boardMessages: [action.payload, ...state.boardMessages]
            };

        case MESSAGE_ACTIONS.UPDATE_MESSAGE:
            return {
                ...state,
                boardMessages: state.boardMessages.map(msg =>
                    msg._id === action.payload._id
                        ? {
                            ...action.payload,
                            sender: msg.sender  // Preserve the existing sender information
                            }
                        : msg
                ),
                loading: false
            };

        case MESSAGE_ACTIONS.DELETE_MESSAGE:
            return {
                ...state,
                boardMessages: state.boardMessages.filter(msg =>
                    msg._id !== action.payload
                ),
                loading: false
            };

            case MESSAGE_ACTIONS.MARK_MESSAGES_READ:
                return {
                    ...state,
                    boardMessages: state.boardMessages.map(msg =>
                        action.payload.messageIds.includes(msg._id)
                            ? { ...msg, read: [...new Set([...msg.read, action.payload.userId])] }
                            : msg
                    )
                };

            default:
                return state;
    }
};

// The Provider component that will wrap our app
export const MessageProvider = ({ children }) => {
    // Set up our state management using useReducer
    const [state, dispatch] = useReducer(messageReducer, initialState);

    // Get our message service functions
    const messageService = useMessageService();

    // Get the current user from AuthContext
    const { currentUser } = useAuth();

    // Function to fetch board messages
    const fetchBoardMessages = useCallback(async (projectId) => {
        dispatch({ type: MESSAGE_ACTIONS.SET_LOADING });
        try {
            const messages = await messageService.getBoardMessages(projectId);
            dispatch({
                type: MESSAGE_ACTIONS.SET_BOARD_MESSAGES,
                payload: messages
            });
        } catch (error) {
            console.error('Error fetching board messages:', error);
            dispatch({
                type: MESSAGE_ACTIONS.SET_ERROR,
                payload: 'Failed to load messages'
            });
        }
    }, [messageService]);

    // Function to create a new message
    const createMessage = useCallback(async (projectId, type, content, recipients = [], parentMessage = null) => {
        // First, check if we have a logged-in user
        if (!currentUser) {
            throw new Error('You must be logged in to create messages');
        }

        try {
            // Create the message using our service
            const newMessage = await messageService.createMessage(
                projectId,
                type,
                content,
                recipients,
                parentMessage
            );

            // Add the current user's details to the new message
            const enhancedMessage = {
                ...newMessage,
                sender: {
                    _id: currentUser._id,
                    firstName: currentUser.firstName,
                    lastName: currentUser.lastName,
                    email: currentUser.email
                }
            };

            // Update our state with the new message
            dispatch({
                type: MESSAGE_ACTIONS.ADD_MESSAGE,
                payload: enhancedMessage
            });

            return enhancedMessage;
        } catch (error) {
            console.error('Error creating message:', error);
            dispatch({
                type: MESSAGE_ACTIONS.SET_ERROR,
                payload: 'Failed to create message'
            });
            throw error; // Re-throw to handle in the component
        }
    }, [messageService, currentUser]);

    const editMessage = useCallback(async (messageId, content) => {
        dispatch({ type: MESSAGE_ACTIONS.SET_LOADING });
        try {
            const updatedMessage = await messageService.editMessage(messageId, content);
            dispatch({
                type: MESSAGE_ACTIONS.UPDATE_MESSAGE,
                payload: updatedMessage
            });
            return updatedMessage;
        } catch (error) {
            dispatch({
                type: MESSAGE_ACTIONS.SET_ERROR,
                payload: 'Failed to edit message'
            });
            throw error;
        }
    }, [messageService]);

    const deleteMessage = useCallback(async (messageId) => {
        dispatch({ type: MESSAGE_ACTIONS.SET_LOADING });
        try {
            await messageService.deleteMessage(messageId);
            dispatch({
                type: MESSAGE_ACTIONS.DELETE_MESSAGE,
                payload: messageId
            });
        } catch (error) {
            dispatch({
                type: MESSAGE_ACTIONS.SET_ERROR,
                payload: 'Failed to delete message'
            });
            throw error;
        }
    }, [messageService]);

    const addReaction = useCallback(async (messageId, emoji) => {
        try {
            // Get the existing message from state first
            const existingMessage = state.boardMessages.find(msg => msg._id === messageId);

            const updatedMessage = await messageService.addReaction(messageId, emoji);

            // Combine the updated message with the existing sender information
            const messageWithSender = {
                ...updatedMessage,
                sender: existingMessage.sender  // Preserve the sender information
            };

            dispatch({
                type: MESSAGE_ACTIONS.UPDATE_MESSAGE,
                payload: messageWithSender
            });

            return messageWithSender;
        } catch (error) {
            dispatch({
                type: MESSAGE_ACTIONS.SET_ERROR,
                payload: 'Failed to add reaction'
            });
            throw error;
        }
    }, [messageService, state.boardMessages]);

    const markMessagesAsRead = useCallback(async (messageIds) => {
        try {
            // Mark messages as read in the backend
            await Promise.all(
                messageIds.map(messageId =>
                    messageService.markMessageAsRead(messageId)
                )
            );

            // Update local state using currentUser._id directly
            dispatch({
                type: MESSAGE_ACTIONS.MARK_MESSAGES_READ,
                payload: {
                    messageIds,
                    userId: currentUser._id  // Use currentUser._id directly
                }
            });
        } catch (error) {
            console.error('Error marking messages as read:', error);
            dispatch({
                type: MESSAGE_ACTIONS.SET_ERROR,
                payload: 'Failed to mark messages as read'
            });
        }
    }, [messageService, currentUser?._id])

    // Create the value object to provide to consumers
    const value = {
        // State
        boardMessages: state.boardMessages,
        loading: state.loading,
        error: state.error,

        // Methods
        fetchBoardMessages,
        createMessage,
        editMessage,
        deleteMessage,
        addReaction,
        markMessagesAsRead
    };

    // Provide the context to children
    return (
        <MessageContext.Provider value={value}>
            {children}
        </MessageContext.Provider>
    );
};

// Custom hook to use the message context
export const useMessage = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessage must be used within a MessageProvider');
    }
    return context;
};

export default MessageContext;

MessageProvider.propTypes = {
    children: PropTypes.node.isRequired
};
