import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import styles from './TaskTile.module.css';
import { useEffect, useState } from 'react';
import { useProjectContext } from '../../../context/ProjectContext';
import { useUserContext } from '../../../context/UserContext';

import TaskDetailModal from "../TaskDetailModal/TaskDetailModal"

const TaskTile = ({ task }) => {
    const { currentProject } = useProjectContext();
    const { getUserDetails } = useUserContext();
    const [assignedUser, setAssignedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false)

    useEffect(() => {
        // When the task's assignedTo changes, look up the user
        const loadUserDetails = async () => {
            const user = await getUserDetails(task.assignedTo);
            setAssignedUser(user);
        };

        loadUserDetails();
    }, [task.assignedTo, getUserDetails]);

    const getKanbanColumnName = (columnId) => {
        const column = currentProject?.kanbanColumns.find(col => col._id === columnId);
        return column?.name || 'Unknown';
    };

    const getEisenhowerStatus = () => {
        if (!task.eisenhowerStatus) return 'Not Set';
        const { important, urgent } = task.eisenhowerStatus;
        if (important && urgent) return 'Important & Urgent';
        if (important) return 'Important & Not Urgent';
        if (urgent) return 'Not Important & Urgent';
        return 'Not Important & Not Urgent';
    };

    const isOverdue = () => {
        if (!task.dueDate) return false;
        return dayjs(task.dueDate).isBefore(dayjs(), 'day');
    };

    return (
        <>
        <div
            className={styles['task-tile-container']}
            onClick={() => setIsModalOpen(true)}
            style={{ cursor: 'pointer' }}
        >
            <div className={styles['task-tile-header']}>
                <h2>{task.title}</h2>

            </div>
            <div
                className={styles['task-tile-content']}>
                <div className={styles['task-info-group']}>
                    <h3>Assigned to:</h3>
                    <p>
                        {assignedUser
                            ? `${assignedUser.firstName} ${assignedUser.lastName}`
                            : 'Loading...'
                        }
                    </p>
                </div>
                <div className={styles['task-info-group']}>
                    <h3>Due Date:</h3>
                    <p>{task.dueDate ? dayjs(task.dueDate).format('DD/MM/YYYY') : 'Not set'}</p>
                </div>
                <div className={styles['task-info-group']}>
                    <h3>Overdue:</h3>
                    <p>{isOverdue() ? 'Yes' : 'No'}</p>
                </div>
                <div className={styles['task-info-group']}>
                    <h3>Current Kanban:</h3>
                    <p>{getKanbanColumnName(task.kanbanColumnId)}</p>
                </div>
                {currentProject?.eisenhowerEnabled && (
                    <div className={styles['task-info-group']}>
                        <h3>Eisenhower:</h3>
                        <p className={styles['eisenhower-status']}>{getEisenhowerStatus()}</p>
                    </div>
                )}
                <div className={styles['task-info-group']}>
                    <h3>At Risk:</h3>
                    <p>{task.risk?.isAtRisk ? 'Yes' : 'No'}</p>
                </div>
            </div>
        </div>

        <TaskDetailModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            task={task}
        />
        </>
    );
};

TaskTile.propTypes = {
    task: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string,
        assignedTo: PropTypes.string.isRequired,
        kanbanColumnId: PropTypes.string.isRequired,
        dueDate: PropTypes.string,
        risk: PropTypes.shape({
            isAtRisk: PropTypes.bool
        }),
        eisenhowerStatus: PropTypes.shape({
            important: PropTypes.bool,
            urgent: PropTypes.bool
        })
    }).isRequired
};

export default TaskTile;
