import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts'
import PropTypes from 'prop-types'
import { useProjectContext } from '../../../context/ProjectContext'
import { useTaskContext } from '../../../context/TaskContext'
import { useUserContext } from '../../../context/UserContext'
import styles from './ActivitySection.module.css'

const ActivitySection = ({ height, width }) => {
    const [chartData, setChartData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()

    const { currentProject } = useProjectContext()
    const { tasks } = useTaskContext()
    const { getMultipleUsers, userCache } = useUserContext()

    const handleBarClick = (data) => {
        navigate('/team', {
            state: {
                openModal: true,
                userId: data.userId
            },
            replace: true
        });
    };
/* eslint react/prop-types: 0 */
    const CustomBar = (props) => {
        const { fill, x, y, width, height, data } = props;
        return (
            <g cursor="pointer" onClick={() => handleBarClick({ userId: data.userId })}>
                <rect x={x} y={y} width={width} height={height} fill={fill} />
            </g>
        );
    };


    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null

        return (
            <div className={styles.tooltip}>
                <h4 className={styles.tooltipTitle}>{label}</h4>
                {payload.map((entry, index) => (
                    <div key={index} className={styles.tooltipRow}>
                        <span style={{ color: entry.color }}>{entry.name}: </span>
                        <span>{entry.value}</span>
                    </div>
                ))}
            </div>
        )
    }

    useEffect(() => {
        const loadTeamActivity = async () => {
            if (!currentProject?.team || !tasks) {
                setIsLoading(false)
                return
            }

            try {
                const teamMemberIds = currentProject.team.map(member => member.user)
                const missingUserIds = teamMemberIds.filter(id => !userCache[id])
                if (missingUserIds.length > 0) {
                    await getMultipleUsers(missingUserIds)
                }

                const now = new Date()
                const threeDaysFromNow = new Date(now)
                threeDaysFromNow.setDate(now.getDate() + 3)

                const sevenDaysAgo = new Date(now)
                sevenDaysAgo.setDate(now.getDate() - 7)

                const memberStats = teamMemberIds.map(memberId => {
                    const memberTasks = tasks.filter(task =>
                        task.assignedTo === memberId ||
                        task.collaborators?.includes(memberId)
                    );

                    const tasksDueNext3Days = memberTasks.filter(task => {
                        if (!task.dueDate || task.completed.isCompleted) return false
                        const dueDate = new Date(task.dueDate)
                        return dueDate <= threeDaysFromNow && dueDate >= now
                    }).length

                    const tasksCompletedLast7Days = memberTasks.filter(task => {
                        if (!task.completed.isCompleted) return false
                        const completedDate = new Date(task.completed?.completedOn)
                        return completedDate >= sevenDaysAgo && completedDate <= now
                    }).length

                    const overdueTasks = memberTasks.filter(task => {
                        if (!task.dueDate || task.completed.isCompleted) return false
                        const dueDate = new Date(task.dueDate)
                        return dueDate < now
                    }).length

                    const userDetails = userCache[memberId]
                    const formatUserName = (user) => {
                        if (!user) return `Unknown User`
                        if (user.firstName) return `${user.firstName}`
                        if (user.email) return user.email.split('@')[0]
                        return `User ${memberId.slice(-4)}`
                    };

                    return {
                        name: formatUserName(userDetails),
                        userId: memberId,
                        'Due Soon': tasksDueNext3Days,
                        'Completed Recently': tasksCompletedLast7Days,
                        'Overdue': overdueTasks
                    };
                });
                setChartData(memberStats)
            } catch (error) {
                console.error('Error processing team activity:', error)
            } finally {
                setIsLoading(false)
            }
        };

        loadTeamActivity();
    }, [currentProject?.team, tasks, getMultipleUsers, userCache])

    if (isLoading) {
        return <div className={styles.loading}>Loading team activity...</div>
    }

    if (!currentProject?.team) {
        return <div className={styles.noData}>No project team available</div>
    }

    if (!tasks?.length) {
        return <div className={styles.noData}>There are no tasks for activity to be shown.</div>
    }

    if (!chartData.length) {
        return <div className={styles.noData}>No activity data available</div>
    }

    return (
        <div className={styles.container}>
            <div className={styles.chartWrapper}>
                <ResponsiveContainer height={height} width={width} >
                <BarChart
                        data={chartData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        onClick={(data) => {
                            if (data && data.activePayload) {
                                handleBarClick({ userId: data.activePayload[0].payload.userId })
                            }
                        }}
                        cursor={'pointer'}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            tick={{ fill: '#666', fontSize: 14 }}
                            height={60}
                            interval={0}
                            angle={0}
                        />
                        <YAxis
                            allowDecimals={false}
                            tick={{ fill: '#666', fontSize: 12 }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                            dataKey="Completed Recently"
                            fill="#82ca9d"
                            barSize={20}
                            shape={<CustomBar />}
                        />
                        <Bar
                            dataKey="Due Soon"
                            fill="#8884d8"
                            barSize={20}
                            shape={<CustomBar />}
                        />
                        <Bar
                            dataKey="Overdue"
                            fill="#ff8042"
                            barSize={20}
                            shape={<CustomBar />}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}


ActivitySection.propTypes = {
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
}

export default ActivitySection;
