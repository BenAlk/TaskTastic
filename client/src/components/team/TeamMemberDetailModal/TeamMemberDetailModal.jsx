import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs'
import styles from './TeamMemberDetailModal.module.css';
import Modal from '../../common/Modal/Modal';
import { useProjectContext } from '../../../context/ProjectContext';
import { useTaskContext } from '../../../context/TaskContext'

const TeamMemberDetailModal = ({ isOpen, onClose, member, userDetails }) => {
    const [formData, setFormData] = useState({
        role: member?.role || 'member'
    });
    const [isEditing, setIsEditing] = useState(false);
    const [activeTasks, setActiveTasks] = useState([])
    const { removeTeamMember, currentProject } = useProjectContext();
    const {tasks} = useTaskContext()

    useEffect(() => {
        if (!isOpen) {
            // Clean up state when modal closes
            setIsEditing(false);
            setActiveTasks([]);
            setFormData({
                role: member?.role || 'member'
            });
        } else if (isOpen && member) {
            // Initialize state when modal opens
            setFormData({
                role: member.role
            });
            setIsEditing(false);

            // Get all tasks for this user
            const userTasks = tasks.filter(task =>
                String(task.assignedTo) === String(member.user) && !task.completedDate
            );

            // Organize tasks by project and add overdue status
            const tasksMap = userTasks.reduce((acc, task) => {
                const isOverdue = task.dueDate && dayjs(task.dueDate).isBefore(dayjs(), 'day');

                if (!acc[task.projectId]) {
                    acc[task.projectId] = {
                        projectId: task.projectId,
                        projectName: task.projectName,
                        tasks: []
                    };
                }

                acc[task.projectId].tasks.push({
                    ...task,
                    isOverdue
                });

                // Sort tasks by due date
                acc[task.projectId].tasks.sort((a, b) => {
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return dayjs(a.dueDate).diff(dayjs(b.dueDate));
                });

                return acc;
            }, {});

            setActiveTasks(Object.values(tasksMap));
        }
    }, [isOpen, member, tasks]);

    const isProjectOwner = currentProject?.projectOwner === member?.user;

    const handleRoleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            role: e.target.value
        }));
    };

    const handleSave = async () => {
        try {
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating team member:', error);
        }
    };

    const handleRemove = async () => {
        if (window.confirm('Are you sure you want to remove this team member?')) {
            await removeTeamMember(member.user);
            onClose();
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEditing ? "Edit Team Member" : "Team Member Details"}
            closeOnClickOutside={true}
        >
            <div className={styles['modal-content']}>
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
                                Save Changes
                            </div>
                        </>
                    ) : (
                        <>
                            {!isProjectOwner && (
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
                            {!isProjectOwner && (
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
            </div>
        </Modal>
    );
};

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
};

export default TeamMemberDetailModal;
