import { useEffect, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';
import PropTypes from 'prop-types';
import { useUserContext } from '../../../../context/UserContext';
import styles from './Task.module.css';

const Task = ({ task, index, columnId, isEditing, isMoving, moveTask }) => {
    const { getUserDetails } = useUserContext();
    const [assignedUser, setAssignedUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const dragDropRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (task.assignedTo) {
                setIsLoading(true);
                try {
                    const userData = await getUserDetails(task.assignedTo);
                    setAssignedUser(userData);
                } catch (error) {
                    console.error('Error fetching user details:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, [task.assignedTo, getUserDetails]);

    const getFullName = (user) => {
        if (!user) return 'Unassigned';
        return `${user.firstName} ${user.lastName}`.trim();
    };

    const getInitials = (user) => {
        if (!user) return '?';
        return user.firstName.charAt(0);
    };

    const [{ isDragging }, drag] = useDrag({
        type: 'TASK',
        item: {
            type: 'TASK',
            index,
            columnId,
            taskId: task._id
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: () => !isEditing
    });

    drag(dragDropRef);

    const formattedDueDate = task.dueDate
        ? new Date(task.dueDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
        })
        : null;

    return (
        <div
            ref={dragDropRef}
            className={[
                styles['task-container'],
                isDragging ? styles['task-dragging'] : '',
                isMoving ? styles['task-moving'] : ''
            ].filter(Boolean).join(' ')}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <div className={styles['task-header-container']}>
                <h3 className={styles['task-title']}>{task.title}</h3>
            </div>
            <div className={styles['task-content-container']}>
                <div className={styles['task-assigned-container']}>
                    <div className={`${styles['user-avatar']} ${isLoading ? styles['loading'] : ''}`}>
                        {!isLoading
                            ? getInitials(assignedUser)
                            : '...'
                        }
                    </div>
                    <span className={styles['assigned-name']}>
                        {isLoading
                            ? 'Loading...'
                            : getFullName(assignedUser)
                        }
                    </span>
                </div>
                {formattedDueDate && (
                    <div className={styles['task-due-container']}>
                        <span className={`${styles['due-date']} ${
                            new Date(task.dueDate) < new Date() ? styles['due-date-overdue'] : ''
                        }`}>
                            Due {formattedDueDate}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

Task.propTypes = {
    task: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        assignedTo: PropTypes.string,
        dueDate: PropTypes.string,
    }).isRequired,
    index: PropTypes.number.isRequired,
    moveTask: PropTypes.func.isRequired,
    columnId: PropTypes.string.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isMoving: PropTypes.bool.isRequired,
};

export default Task;
