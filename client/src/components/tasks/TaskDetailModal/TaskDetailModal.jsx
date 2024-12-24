import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useTaskContext } from '../../../context/TaskContext';
import { useUserContext } from '../../../context/UserContext';
import { useProjectContext } from '../../../context/ProjectContext';
import styles from './TaskDetailModal.module.css';
import Modal from '../../common/Modal/Modal';

const TaskDetailModal = ({ isOpen, onClose, task }) => {
    const { updateTask, deleteTask } = useTaskContext();
    const { getUserDetails } = useUserContext();
    const { currentProject } = useProjectContext();
    const [assignedUser, setAssignedUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: task?.title || '',
        description: task?.description || '',
        dueDate: task?.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DD') : '',
        risk: { isAtRisk: task?.risk?.isAtRisk || false },
        eisenhowerStatus: task?.eisenhowerStatus || { important: false, urgent: false },
        completed: {
            isCompleted: task?.completed?.isCompleted || false,
            completedOn: task?.completed?.completedOn || null
        }
    });

    useEffect(() => {
        if (task && isOpen) {
            setFormData({
                title: task.title,
                description: task.description || '',
                dueDate: task.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DD') : '',
                risk: { isAtRisk: task.risk?.isAtRisk || false},
                eisenhowerStatus: task.eisenhowerStatus || { important: false, urgent: false },
                completed: {
                    isCompleted: task?.completed?.isCompleted || false,
                    completedOn: task?.completed?.completedOn || null
                }
            });

            const loadUserDetails = async () => {
                const user = await getUserDetails(task.assignedTo);
                setAssignedUser(user);
            };
            loadUserDetails();
        }
    }, [task, isOpen]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        if (name === 'isAtRisk') {
            // Handle risk status change
            setFormData(prev => ({
                ...prev,
                risk: { isAtRisk: checked }
            }));
        } else if (name === 'isCompleted') {
            setFormData(prev => ({
                ...prev,
                completed: {
                    isCompleted: checked,
                    completedOn: checked ? new Date().toISOString() : null
                }
            }))
        }else if (name.startsWith('eisenhower')) {
            const property = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                eisenhowerStatus: {
                    ...prev.eisenhowerStatus,
                    [property]: checked
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const getKanbanColumnName = (columnId) => {
        const column = currentProject?.kanbanColumns.find(col => col._id === columnId);
        return column?.name || 'Unknown';
    };

    const handleSave = async () => {
        try {
            await updateTask(task._id, formData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating task:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            await deleteTask(task._id);
            onClose();
        }
    };

    const handleClose = () => {
        setIsEditing(false);
        setFormData({
            title: task?.title || '',
            description: task?.description || '',
            dueDate: task?.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DD') : '',
            risk: { isAtRisk: task?.risk?.isAtRisk || false },
            eisenhowerStatus: task?.eisenhowerStatus || { important: false, urgent: false },
            completed: {
                isCompleted: task?.completed?.isCompleted || false,
                completedOn: task?.completed?.completedOn || null
            }

        });
        onClose();
    };

    const handleCancelEdit = () => {
        setFormData({
            title: task?.title || '',
            description: task?.description || '',
            dueDate: task?.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DD') : '',
            risk: { isAtRisk: task?.risk?.isAtRisk || false },
            eisenhowerStatus: task?.eisenhowerStatus || { important: false, urgent: false },
            completed: {
                isCompleted: task?.completed?.isCompleted || false,
                completedOn: task?.completed?.completedOn || null
            }

        });
        setIsEditing(false);
    };

    if (!task) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={isEditing ? "Edit Task" : task.title}
            closeOnOverlayClick={!isEditing}
        >
            <div className={styles['modal-content']}>
                {isEditing ? (
                    <>
                        <div className={styles['form-group']}>
                            <label className={styles['form-label']}>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className={styles['form-input']}
                            />
                        </div>

                        <div className={styles['form-group']}>
                            <label className={styles['form-label']}>Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className={styles['form-textarea']}
                                rows="4"
                            />
                        </div>

                        <div className={styles['form-group']}>
                            <label className={styles['form-label']}>Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                                className={styles['form-input']}
                            />
                        </div>

                        {currentProject?.eisenhowerEnabled && (
                            <div className={styles['eisenhower-section']}>
                                <label className={styles['form-label']}>Eisenhower Matrix</label>
                                <div className={styles['checkbox-group']}>
                                    <input
                                        type="checkbox"
                                        name="eisenhowerStatus.important"
                                        checked={formData.eisenhowerStatus.important}
                                        onChange={handleInputChange}
                                    />
                                    <label>Important</label>
                                </div>
                                <div className={styles['checkbox-group']}>
                                    <input
                                        type="checkbox"
                                        name="eisenhowerStatus.urgent"
                                        checked={formData.eisenhowerStatus.urgent}
                                        onChange={handleInputChange}
                                    />
                                    <label>Urgent</label>
                                </div>
                            </div>
                        )}

                        <div className={styles['checkbox-group']}>
                            <input
                                type="checkbox"
                                name="isAtRisk"
                                checked={formData.risk.isAtRisk}  // Updated path
                                onChange={handleInputChange}
                            />
                            <label>Mark task as at risk</label>
                        </div>

                        <div className={styles['checkbox-group']}>
                            <input
                                type="checkbox"
                                name="isCompleted"
                                checked={formData.completed?.isCompleted || false}  // Updated path
                                onChange={handleInputChange}
                            />
                            <label>Mark task as complete.</label>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles['detail-group']}>
                            <h3>Description:</h3>
                            <p>{task.description || 'No description provided'}</p>
                        </div>

                        <div className={styles['detail-group']}>
                            <h3>Assigned to:</h3>
                            <p>{assignedUser ? `${assignedUser.firstName} ${assignedUser.lastName}` : 'Loading...'}</p>
                        </div>

                        <div className={styles['detail-group']}>
                            <h3>Due Date:</h3>
                            <p>{task.dueDate ? dayjs(task.dueDate).format('DD/MM/YYYY') : 'Not set'}</p>
                        </div>

                        <div className={styles['detail-group']}>
                            <h3>Current Status:</h3>
                            <p>{getKanbanColumnName(task.kanbanColumnId)}</p>
                        </div>

                        {currentProject?.eisenhowerEnabled && (
                            <div className={styles['detail-group']}>
                                <h3>Eisenhower Status:</h3>
                                <p>
                                    {task.eisenhowerStatus?.important ? 'Important' : 'Not Important'}
                                    {' & '}
                                    {task.eisenhowerStatus?.urgent ? 'Urgent' : 'Not Urgent'}
                                </p>
                            </div>
                        )}

                        <div className={styles['detail-group']}>
                            <h3>Risk Status:</h3>
                            <p>{formData.risk.isAtRisk ? 'At Risk' : 'Not At Risk'}</p>
                        </div>
                        <div className={styles['detail-group']}>
                            <h3>Task Complete:</h3>
                            <p>{formData.completed?.isCompleted ? 'Yes' : 'No'}</p>
                        </div>
                    </>
                )}

                {isEditing ? (
                    <div className={styles['button-group']}>
                        <div
                            className={styles['cancel-button']}
                            onClick={handleCancelEdit}
                        >
                            Cancel
                        </div>
                        <div
                            className={styles['save-button']}
                            onClick={handleSave}
                        >
                            Save Changes
                        </div>
                    </div>
                ) : (
                    <div className={styles['button-group']}>
                        <div
                            className={styles['delete-button']}
                            onClick={handleDelete}
                        >
                            Delete
                        </div>
                        <div
                            className={styles['cancel-button']}
                            onClick={handleClose}
                        >
                            Close
                        </div>
                        <div
                            className={styles['save-button']}
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Task
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
};

TaskDetailModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
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
        }),
        completed: PropTypes.shape({
            isCompleted: PropTypes.bool,
            completedOn: PropTypes.string
        })
    })
};

export default TaskDetailModal;
