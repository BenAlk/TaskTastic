import PropTypes from 'prop-types'
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import styles from './TeamMemberDetailModal.module.css'
import Modal from '../../common/Modal/Modal'
import { useProjectContext } from '../../../context/ProjectContext'
import { useTaskContext } from '../../../context/TaskContext'
import { useProjectPermissions } from '../../../hooks/useProjectPermissions'

const TeamMemberDetailModal = ({ isOpen, onClose, member: initialMember, userDetails }) => {
    const { removeTeamMember, currentProject, updateCurrentProject, lastUpdate } = useProjectContext()
    const { tasks } = useTaskContext()
    const { getUserProjectRole } = useProjectPermissions()

    const currentUserRole = getUserProjectRole()
    const canEditMembers = currentUserRole === 'owner' || currentUserRole === 'admin'

    const member = useMemo(() => {
        return currentProject?.team.find(m => m.user === initialMember.user) || initialMember
    }, [currentProject?.team, initialMember.user, lastUpdate])

    const [formData, setFormData] = useState({
        role: member?.role || 'member'
    })
    const [isEditing, setIsEditing] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')
    const [activeTasks, setActiveTasks] = useState([])
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)

  const navigate = useNavigate()

    const handleTaskClick = (taskId) => {
        navigate(`/tasks?taskId=${taskId}`)
    }

    useEffect(() => {
        if (!isOpen) {
            setIsEditing(false)
            setShowConfirmation(false)
            setSuccessMessage('')
            setActiveTasks([])
            setFormData({
                role: member?.role || 'member'
            })
        } else if (isOpen && member) {
            setFormData({
                role: member.role
            })
            setIsEditing(false)

            const userTasks = tasks.filter(task =>
                String(task.assignedTo) === String(member.user) &&
                (!task.completed?.isCompleted)
            )

            const tasksMap = userTasks.reduce((acc, task) => {
                const isOverdue = task.dueDate && dayjs(task.dueDate).isBefore(dayjs(), 'day')

                if (!acc[task.projectId]) {
                    acc[task.projectId] = {
                        projectId: task.projectId,
                        projectName: task.projectName,
                        tasks: []
                    }
                }

                acc[task.projectId].tasks.push({
                    ...task,
                    isOverdue
                })

                acc[task.projectId].tasks.sort((a, b) => {
                    if (!a.dueDate) return 1
                    if (!b.dueDate) return -1
                    return dayjs(a.dueDate).diff(dayjs(b.dueDate))
                })

                return acc
            }, {})

            setActiveTasks(Object.values(tasksMap))
        }
    }, [isOpen, member, tasks])

    const isProjectOwner = currentProject?.projectOwner === member?.user

    const handleRoleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            role: e.target.value
        }))
    }

    const handleSave = () => {
        setShowConfirmation(true)
    }

    const handleConfirmSave = async () => {
        try {
            const updatedTeam = currentProject.team.map(teamMember =>
                teamMember.user === member.user
                    ? { ...teamMember, role: formData.role }
                    : teamMember
            )

            await updateCurrentProject({ team: updatedTeam })

            setSuccessMessage('Team member role updated successfully!')
            setTimeout(() => {
                setIsEditing(false)
                setShowConfirmation(false)
                setSuccessMessage('')
            }, 1500)
        } catch (error) {
            console.error('Error updating team member:', error)
        }
    };

    const handleRemove = () => {
        if (!canEditMembers || isProjectOwner) return
        setShowDeleteConfirmation(true)
    }

    const handleConfirmRemove = async () => {
        try {
            await removeTeamMember(member.user)
            setSuccessMessage('Team member removed successfully!')
            setTimeout(() => {
                setShowDeleteConfirmation(false)
                setSuccessMessage('')
                onClose()
            }, 1500)
        } catch (error) {
            console.error('Error removing team member:', error)
        }
    }

    const renderDeleteConfirmation = () => (
        <div className={styles['confirmation-content']}>
            <h3 className={styles['confirmation-title']}>Remove Team Member</h3>
            <div className={styles['confirmation-details']}>
                <p>Are you sure you want to remove this team member?</p>
                <p>Member: {userDetails.firstName} {userDetails.lastName}</p>
                <p>Role: {member.role}</p>
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
                    onClick={handleConfirmRemove}
                >
                    Confirm Remove
                </div>
            </div>
        </div>
    )

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={
                showDeleteConfirmation
                    ? "Remove Team Member"
                    : showConfirmation
                        ? "Confirm Role Change"
                        : (isEditing ? "Edit Team Member" : "Team Member Details")
            }
            closeOnClickOutside={!isEditing && !showDeleteConfirmation}
        >
            <div className={styles['modal-content']}>
                {successMessage ? (
                    <div className={styles['success-message']}>
                        {successMessage}
                    </div>
                ) : showDeleteConfirmation ? (
                    renderDeleteConfirmation()
                ) : showConfirmation ? (
                    <div className={styles['confirmation-content']}>
                        <h3 className={styles['confirmation-title']}>Update Team Member Role</h3>
                        <div className={styles['confirmation-details']}>
                            <p>Member: {userDetails.firstName} {userDetails.lastName}</p>
                            <p>Current Role: {member.role}</p>
                            <p>New Role: {formData.role}</p>
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
                                Update Role
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        {isEditing ? (
                            <>
                                <div className={styles['form-group']}>
                                    <label className={styles['form-label']}>Name</label>
                                    <div className={styles['form-value']}>
                                        {userDetails.firstName} {userDetails.lastName}
                                    </div>
                                </div>

                                <div className={styles['form-group']}>
                                    <label className={styles['form-label']}>Email</label>
                                    <div className={styles['form-value']}>
                                        {userDetails.email}
                                    </div>
                                </div>

                                {!isProjectOwner && (
                                    <div className={styles['form-group']}>
                                        <label className={styles['form-label']}>Role</label>
                                        <select
                                            value={formData.role}
                                            onChange={handleRoleChange}
                                            className={styles['form-input']}
                                        >
                                            <option value="member">Member</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                <div className={styles['detail-group']}>
                                    <h3>Name:</h3>
                                    <p>{userDetails.firstName} {userDetails.lastName}</p>
                                </div>

                                <div className={styles['detail-group']}>
                                    <h3>Email:</h3>
                                    <p>{userDetails.email}</p>
                                </div>

                                <div className={styles['detail-group']}>
                                    <h3>Role:</h3>
                                    <p>{isProjectOwner ? 'Project Owner' : member.role}</p>
                                </div>

                                <div className={styles['projects-section']}>
                                    <h3 className={styles['projects-header']}>Active Projects</h3>
                                    {activeTasks.length > 0 ? (
                                        <div className={styles['projects-list']}>
                                            {activeTasks.map(project => (
                                                <div
                                                    key={project.projectId}
                                                    className={styles['project-item']}
                                                >
                                                    <div className={styles['project-name']}>
                                                        {project.projectName}
                                                    </div>
                                                    <div className={styles['tasks-list']}>
                                                        {project.tasks.map(task => (
                                                            <div
                                                                key={task._id}
                                                                className={`${styles['task-item']} ${
                                                                    task.isOverdue ? styles['task-overdue'] : ''
                                                                }`}
                                                                onClick={() => handleTaskClick(task._id)}
                                                            >
                                                                <div className={styles['task-title']}>
                                                                    {task.title}
                                                                </div>
                                                                {task.dueDate && (
                                                                    <div className={styles['task-due-date']}>
                                                                        Due: {dayjs(task.dueDate).format('MMM D, YYYY')}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className={styles['no-projects']}>
                                            No active projects
                                        </p>
                                    )}
                                </div>
                            </>
                        )}

                        <div className={styles['button-group']}>
                            {isEditing ? (
                                <>
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
                                </>
                            ) : (
                                <>
                                    {!isProjectOwner && canEditMembers && (
                                        <div
                                            className={styles['delete-button']}
                                            onClick={handleRemove}
                                        >
                                            Remove Member
                                        </div>
                                    )}
                                    <div
                                        className={styles['cancel-button']}
                                        onClick={onClose}
                                    >
                                        Close
                                    </div>
                                    {!isProjectOwner && canEditMembers && (
                                        <div
                                            className={styles['save-button']}
                                            onClick={() => setIsEditing(true)}
                                        >
                                            Edit Member
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </Modal>
    )
}

TeamMemberDetailModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    member: PropTypes.shape({
        user: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired
    }),
    userDetails: PropTypes.shape({
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        email: PropTypes.string
    })
}

export default TeamMemberDetailModal
