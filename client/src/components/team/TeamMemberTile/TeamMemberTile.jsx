import PropTypes from 'prop-types'
import { useState, useEffect, useMemo } from 'react'
import dayjs from 'dayjs'
import styles from './TeamMemberTile.module.css'
import { useUserContext } from '../../../context/UserContext'
import { useTaskContext } from '../../../context/TaskContext'
import { useProjectContext } from '../../../context/ProjectContext'
import { useAuth } from '../../../context/AuthContext'
import TeamMemberDetailModal from '../TeamMemberDetailModal/TeamMemberDetailModal'

const TeamMemberTile = ({ member: initialMember, openModal, onModalClosed }) => {
    const { userCache } = useUserContext()
    const { tasks, fetchTasks } = useTaskContext()
    const { currentProject, lastUpdate } = useProjectContext()
    const { currentUser } = useAuth()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [taskStats, setTaskStats] = useState({
        totalTasks: 0,
        overdueTasks: 0
    })

    useEffect(() => {
        if (openModal) {
            setIsModalOpen(true)
        }
    }, [openModal])

    const member = useMemo(() => {
        return currentProject?.team.find(m => m.user === initialMember.user) || initialMember
    }, [currentProject?.team, initialMember.user, lastUpdate])

    const handleModalClose = (e) => {
        if (e) {
            e.stopPropagation()
        }
        setIsModalOpen(false)
        if (onModalClosed) {
            onModalClosed()
        }
    }

    const handleTileClick = (e) => {
        e.stopPropagation();
        setIsModalOpen(true);
    }

    const userPermissions = useMemo(() => {
        if (!currentProject || !currentUser) return { canViewTaskStats: false }

        return {
            canViewTaskStats: (
                currentProject.projectOwner === currentUser._id ||
                currentProject.team.some(teamMember =>
                    teamMember.user === currentUser._id &&
                    teamMember.role === 'admin'
                )
            )
        }
    }, [currentProject, currentUser])

    useEffect(() => {
        if (currentProject?._id) {
            fetchTasks(currentProject._id)
        } else {
            setTaskStats({
                totalTasks: 0,
                overdueTasks: 0
            })
        }
    }, [currentProject?._id])

    useEffect(() => {
        const calculateTaskStats = () => {
            if (!userPermissions.canViewTaskStats) {
                setTaskStats({
                    totalTasks: 0,
                    overdueTasks: 0
                })
                return
            }

            if (!currentProject?._id || !tasks?.length) {
                setTaskStats({
                    totalTasks: 0,
                    overdueTasks: 0
                })
                return
            }

            const userTasks = tasks.filter(task =>
                String(task.assignedTo) === String(member.user) &&
                !task.completed?.isCompleted
            )

            const today = dayjs();
            const overdue = userTasks.filter(task => {
                if (!task.dueDate || task.completedDate) return false
                return dayjs(task.dueDate).isBefore(today, 'day')
            })

            setTaskStats({
                totalTasks: userTasks.length,
                overdueTasks: overdue.length
            })
        }

        calculateTaskStats();
    }, [tasks, currentProject?._id, userPermissions.canViewTaskStats])

    const userDetails = userCache[member.user] || {}

    return (
        <>
            <div
                className={styles['member-tile-container']}
                onClick={handleTileClick}
                style={{ cursor: 'pointer' }}
            >
                <div className={styles['member-tile-header']}>
                    <h2>{userDetails.firstName} {userDetails.lastName}</h2>
                </div>

                <div className={styles['member-tile-content']}>
                    <div className={styles['member-info-group']}>
                        <h3>Role:</h3>
                        <p>{member.role}</p>
                    </div>

                    <div className={styles['member-info-group']}>
                        <h3>Email:</h3>
                        <p>{userDetails.email}</p>
                    </div>

                    {userPermissions.canViewTaskStats ? (
                        <div className={styles['task-stats-container']}>
                            <div className={styles['member-info-group']}>
                                <h3 className={styles['task-count-header']}>Active Tasks:</h3>
                                <p className={`${styles['task-count']} ${
                                    taskStats.totalTasks > 5 ? styles['high-workload'] : ''
                                }`}>
                                    {taskStats.totalTasks}
                                </p>
                            </div>
                            <div className={styles['member-info-group']}>
                                <h3 className={styles['task-count-header']}>Overdue:</h3>
                                <p className={`${styles['task-count']} ${
                                    taskStats.overdueTasks > 0 ? styles['overdue'] : ''
                                }`}>
                                    {taskStats.overdueTasks}
                                </p>
                            </div>
                        </div>
                    ) : null}
                </div>
            </div>
            <TeamMemberDetailModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                member={member}
                userDetails={userDetails}
            />
        </>
    )
}

TeamMemberTile.propTypes = {
    member: PropTypes.shape({
        user: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired
    }).isRequired,
    openModal: PropTypes.bool,
    onModalClosed: PropTypes.func
}

export default TeamMemberTile
