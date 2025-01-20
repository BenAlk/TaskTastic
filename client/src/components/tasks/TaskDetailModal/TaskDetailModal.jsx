import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import { useTaskContext } from '../../../context/TaskContext'
import { useUserContext } from '../../../context/UserContext'
import { useProjectContext } from '../../../context/ProjectContext'
import { useProjectPermissions } from '../../../hooks/useProjectPermissions'
import { useAuth } from '../../../context/AuthContext'
import styles from './TaskDetailModal.module.css'
import Modal from '../../common/Modal/Modal'

const TaskDetailModal = ({ isOpen, onClose, task }) => {
    const { updateTask, deleteTask } = useTaskContext()
    const { getUserDetails, getMultipleUsers } = useUserContext()
    const { currentProject } = useProjectContext()
    const { getUserProjectRole } = useProjectPermissions()
    const { currentUser } = useAuth()

    const [assignedUser, setAssignedUser] = useState(null)
    const [teamMembers, setTeamMembers] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [formData, setFormData] = useState({
        title: task?.title || '',
        description: task?.description || '',
        assignedTo: task?.assignedTo || '',
        dueDate: task?.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DD') : '',
        risk: { isAtRisk: task?.risk?.isAtRisk || false },
        eisenhowerStatus: task?.eisenhowerStatus || { important: false, urgent: false },
        completed: {
            isCompleted: task?.completed?.isCompleted || false,
            completedOn: task?.completed?.completedOn || null
        }
    })

    const currentUserRole = getUserProjectRole()
    const isAdmin = currentUserRole === 'owner' || currentUserRole === 'admin'
    const isAssignedUser = task?.assignedTo === currentUser?._id

    const canEditEverything = isAdmin
    const canEditRiskAndCompletion = isAssignedUser
    const canEdit = canEditEverything || canEditRiskAndCompletion
    const canDelete = isAdmin

    useEffect(() => {
        const fetchTeamMembers = async () => {
            if (currentProject?.team && currentProject.team.length > 0) {
                const userIds = currentProject.team.map(member => member.user)
                const userDetails = await getMultipleUsers(userIds)
                setTeamMembers(userDetails)
            }
        };

        if (isOpen && canEditEverything) {
            fetchTeamMembers()
        }
    }, [isOpen, currentProject?.team, canEditEverything, getMultipleUsers])

    useEffect(() => {
        if (task && isOpen) {
            setFormData({
                title: task.title,
                description: task.description || '',
                assignedTo: task.assignedTo,
                dueDate: task.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DD') : '',
                risk: { isAtRisk: task.risk?.isAtRisk || false },
                eisenhowerStatus: task.eisenhowerStatus || { important: false, urgent: false },
                completed: {
                    isCompleted: task?.completed?.isCompleted || false,
                    completedOn: task?.completed?.completedOn || null
                }
            })

            const loadUserDetails = async () => {
                const user = await getUserDetails(task.assignedTo)
                setAssignedUser(user)
            }
            loadUserDetails()
        }
    }, [task, isOpen, getUserDetails])

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target

        if (!canEditEverything && !canEditRiskAndCompletion) return
        if (!canEditEverything && !['isAtRisk', 'isCompleted'].includes(name)) return

        if (name === 'isAtRisk') {
            setFormData(prev => ({
                ...prev,
                risk: { isAtRisk: checked }
            }))
        } else if (name === 'isCompleted') {
            const completeColumn = currentProject?.kanbanColumns.find(
                col => col.name.toLowerCase() === 'complete' ||
                       col.name.toLowerCase() === 'completed'
            )

            setFormData(prev => ({
                ...prev,
                completed: {
                    isCompleted: checked,
                    completedOn: checked ? new Date().toISOString() : null
                },
                ...(checked && completeColumn && {
                    kanbanColumnId: completeColumn._id
                })
            }))
        } else if (name.startsWith('eisenhower')) {
            const property = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                eisenhowerStatus: {
                    ...prev.eisenhowerStatus,
                    [property]: checked
                }
            }))
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }))
        }
    }

    const handleSave = () => {
        setShowConfirmation(true)
    }

    const handleConfirmSave = async () => {
        try {
            if (!canEditEverything && canEditRiskAndCompletion) {
                const limitedUpdate = {
                    risk: formData.risk,
                    completed: formData.completed
                };
                await updateTask(task._id, limitedUpdate)
            } else if (canEditEverything) {
                await updateTask(task._id, formData)
            }
            setSuccessMessage('Task updated successfully!')
            setTimeout(() => {
                setIsEditing(false)
                setShowConfirmation(false)
                setSuccessMessage('')
                onClose()
            }, 1500)
        } catch (error) {
            console.error('Error updating task:', error)
        }
    }

    const handleDelete = () => {
        if (!canDelete) return
        setShowDeleteConfirmation(true)
    }

    const handleConfirmDelete = async () => {
        try {
            await deleteTask(task._id)
            setSuccessMessage('Task deleted successfully!')
            setTimeout(() => {
                setShowDeleteConfirmation(false)
                setSuccessMessage('')
                onClose()
            }, 1500)
        } catch (error) {
            console.error('Error deleting task:', error)
        }
    }

    const handleClose = () => {
        setIsEditing(false)
        setShowConfirmation(false)
        setSuccessMessage('')
        setFormData({
            title: task?.title || '',
            description: task?.description || '',
            assignedTo: task?.assignedTo || '',
            dueDate: task?.dueDate ? dayjs(task.dueDate).format('YYYY-MM-DD') : '',
            risk: { isAtRisk: task?.risk?.isAtRisk || false },
            eisenhowerStatus: task?.eisenhowerStatus || { important: false, urgent: false },
            completed: {
                isCompleted: task?.completed?.isCompleted || false,
                completedOn: task?.completed?.completedOn || null
            }
        })
        onClose()
    }

    const getKanbanColumnName = (columnId) => {
        const column = currentProject?.kanbanColumns.find(col => col._id === columnId);
        return column?.name || 'Unknown'
    }

    const renderConfirmationView = () => (
        <div className={styles['confirmation-content']}>
            <h3 className={styles['confirmation-title']}>Review Task Changes</h3>
            <div className={styles['confirmation-details']}>
                {canEditEverything && (
                    <>
                        <p>Title: {formData.title}</p>
                        <p>Description: {formData.description || 'No description'}</p>
                        <p>Due Date: {formData.dueDate ? dayjs(formData.dueDate).format('DD/MM/YYYY') : 'Not set'}</p>
                        <p>Assigned To: {
                            teamMembers.find(member => member._id === formData.assignedTo)?.firstName || 'Loading...'
                        }</p>
                        {currentProject?.eisenhowerEnabled && (
                            <p>Eisenhower Status: {
                                `${formData.eisenhowerStatus.important ? 'Important' : 'Not Important'} &
                                ${formData.eisenhowerStatus.urgent ? 'Urgent' : 'Not Urgent'}`
                            }</p>
                        )}
                    </>
                )}

                {(canEditEverything || canEditRiskAndCompletion) && (
                    <>
                        <p>Risk Status: {formData.risk.isAtRisk ? 'At Risk' : 'Not At Risk'}</p>
                        <p>Completion Status: {formData.completed?.isCompleted ? 'Complete' : 'Incomplete'}</p>
                    </>
                )}
            </div>

            <div className={styles['button-group']}>
                <div
                    className={styles['cancel-button']}
                    onClick={() => setShowConfirmation(false)}
                >
                    Back to Edit
                </div>
                <div
                    className={styles['save-button']}
                    onClick={handleConfirmSave}
                >
                    Confirm Changes
                </div>
            </div>
        </div>
    )

    const renderEditForm = () => (
        <>
            {canEditEverything && (
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

                    <div className={styles['form-group']}>
                        <label className={styles['form-label']}>Assigned To</label>
                        <select
                            name="assignedTo"
                            value={formData.assignedTo}
                            onChange={handleInputChange}
                            className={styles['form-input']}
                        >
                            {teamMembers.map(member => (
                                <option
                                    key={member._id}
                                    value={member._id}
                                >
                                    {member._id === currentUser._id ? 'Me' : `${member.firstName} ${member.lastName}`}
                                </option>
                            ))}
                        </select>
                    </div>

                    {currentProject?.eisenhowerEnabled && (
                        <div className={styles['eisenhower-section']}>
                            <label className={styles['form-label']}>Eisenhower Matrix</label>
                            <div className={styles['checkbox-group']}>
                                <input
                                    type="checkbox"
                                    id="important"
                                    name="eisenhowerStatus.important"
                                    checked={formData.eisenhowerStatus.important}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="important">Important</label>
                            </div>
                            <div className={styles['checkbox-group']}>
                                <input
                                    type="checkbox"
                                    id="urgent"
                                    name="eisenhowerStatus.urgent"
                                    checked={formData.eisenhowerStatus.urgent}
                                    onChange={handleInputChange}
                                />
                                <label htmlFor="urgent">Urgent</label>
                            </div>
                        </div>
                    )}
                </>
            )}

            {(canEditEverything || canEditRiskAndCompletion) && (
                <>
                    <div className={styles['checkbox-group']}>
                        <input
                            type="checkbox"
                            id="isAtRisk"
                            name="isAtRisk"
                            checked={formData.risk.isAtRisk}
                            onChange={handleInputChange}
                        />
                        <label htmlFor="isAtRisk">Mark task as at risk</label>
                    </div>

                    <div className={styles['checkbox-group']}>
                        <input
                            type="checkbox"
                            id="isCompleted"
                            name="isCompleted"
                            checked={formData.completed?.isCompleted || false}
                            onChange={handleInputChange}
                        />
                        <label htmlFor="isCompleted">Mark task as complete</label>
                    </div>
                </>
            )}

            <div className={styles['button-group']}>
                <div
                    className={styles['cancel-button']}
                    onClick={() => setIsEditing(false)}
                >
                    Cancel
                </div>
                <div
                    className={styles['save-button']}
                    onClick={handleSave}
                >
                    Review Changes
                </div>
            </div>
        </>
    )

    const renderViewMode = () => (
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

            <div className={styles['button-group']}>
                {canDelete && (
                    <div
                        className={styles['delete-button']}
                        onClick={handleDelete}
                    >
                        Delete
                    </div>
                )}
                <div
                    className={styles['cancel-button']}
                    onClick={handleClose}
                >
                    Close
                </div>
                {canEdit && (
                    <div
                        className={styles['save-button']}
                        onClick={() => setIsEditing(true)}
                    >
                        Edit Task
                    </div>
                )}
            </div>
        </>
    )

    const renderDeleteConfirmation = () => (
        <div className={styles['confirmation-content']}>
            <h3 className={styles['confirmation-title']}>Delete Task</h3>
            <div className={styles['confirmation-details']}>
                <p>Are you sure you want to delete this task?</p>
                <p>Title: {task.title}</p>
                <p>This action cannot be undone.</p>
            </div>

            <div className={styles['button-group']}>
                <div
                    className={styles['cancel-button']}
                    onClick={() => setShowDeleteConfirmation(false)}
                >
                    Cancel
                </div>
                <div
                    className={styles['delete-button']}
                    onClick={handleConfirmDelete}
                >
                    Confirm Delete
                </div>
            </div>
        </div>
    )

    if (!task) return null

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={
                showDeleteConfirmation
                    ? "Delete Task"
                    : isEditing
                        ? (showConfirmation ? "Confirm Task Update" : "Edit Task")
                        : task.title
            }
            closeOnOverlayClick={!isEditing && !showDeleteConfirmation}
        >
            <div className={styles['modal-content']}>
                {successMessage ? (
                    <div className={styles['success-message']}>
                        {successMessage}
                    </div>
                ) : showDeleteConfirmation ? (
                    renderDeleteConfirmation()
                ) : isEditing ? (
                    showConfirmation ? (
                        renderConfirmationView()
                    ) : (
                        renderEditForm()
                    )
                ) : (
                    renderViewMode()
                )}
            </div>
        </Modal>
    )
}

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
}

export default TaskDetailModal
