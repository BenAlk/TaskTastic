import React, { useState, useEffect } from 'react';
import {
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    Line,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area
} from 'recharts';
import PropTypes from 'prop-types';
import { useProjectContext } from '../../../context/ProjectContext';
import { useTaskContext } from '../../../context/TaskContext';
import { useUserContext } from '../../../context/UserContext';
import styles from './ActivitySection.module.css';

const ActivitySection = ({ height, width }) => {
    // State management for our chart
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Get data from our contexts
    const { currentProject } = useProjectContext();
    const { tasks } = useTaskContext();
    const { getMultipleUsers, userCache } = useUserContext();

    /* eslint react/prop-types: 0 */
    // Custom tooltip component for better data display
    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload || !payload.length) return null;

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
        );
    };

    // Effect to load and process our data
    useEffect(() => {
        const loadTeamActivity = async () => {
            if (!currentProject?.team || !tasks) {
                setIsLoading(false);
                return;
            }

            try {
                // Get team member IDs and fetch their details
                const teamMemberIds = currentProject.team.map(member => member.user);

                // Only fetch users we don't have in cache
                const missingUserIds = teamMemberIds.filter(id => !userCache[id]);
                if (missingUserIds.length > 0) {
                    await getMultipleUsers(missingUserIds);
                }

                // Set up our date ranges for filtering
                const now = new Date();
                const threeDaysFromNow = new Date(now);
                threeDaysFromNow.setDate(now.getDate() + 3);

                const sevenDaysAgo = new Date(now);
                sevenDaysAgo.setDate(now.getDate() - 7);

                // Process data for each team member
                const memberStats = teamMemberIds.map(memberId => {
                    const memberTasks = tasks.filter(task =>
                        task.assignedTo === memberId ||
                        task.collaborators?.includes(memberId)
                    );

                    const tasksDueNext3Days = memberTasks.filter(task => {
                        const dueDate = new Date(task.dueDate);
                        return dueDate <= threeDaysFromNow && dueDate >= now;
                    }).length;

                    const tasksCompletedLast7Days = memberTasks.filter(task => {
                        const completedDate = new Date(task.completedAt);
                        return completedDate >= sevenDaysAgo && completedDate <= now;
                    }).length;

                    const overdueTasks = memberTasks.filter(task => {
                        const dueDate = new Date(task.dueDate);
                        return dueDate < now && task.status !== 'completed';
                    }).length;

                    const userDetails = userCache[memberId];

                    // Format user's display name
                    const formatUserName = (user) => {
                        if (!user) return `Unknown User`;

                        // If we have both first and last name, use them
                        if (user.firstName) {
                            return `${user.firstName}`;
                        }

                        // Fall back to email if no names are available
                        if (user.email) {
                            return user.email.split('@')[0]; // Show only the part before @
                        }

                        // Last resort
                        return `User ${memberId.slice(-4)}`; // Show last 4 chars of ID
                    };

                    return {
                        name: formatUserName(userDetails),
                        'Tasks Due Next 3 Days': tasksDueNext3Days,
                        'Tasks Completed Last 7 Days': tasksCompletedLast7Days,
                        'Overdue Tasks': overdueTasks
                    };
                });
                setChartData(memberStats);
            } catch (error) {
                console.error('Error processing team activity:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadTeamActivity();
    }, [currentProject?.team, tasks]);

    // Handle loading state
    if (isLoading) {
        return <div className={styles.loading}>Loading team activity...</div>;
    }

    // Handle various error states
    if (!currentProject?.team) {
        return <div className={styles.noData}>No project team available</div>;
    }

    if (!tasks?.length) {
        return <div className={styles.noData}>There are no tasks for activity to be shown.</div>;
    }

    if (!chartData.length) {
        return <div className={styles.noData}>No activity data available</div>;
    }

    // Main render
    return (
        <div className={styles.container}>
            <div className={styles.chartWrapper}>
                <ResponsiveContainer height={height} width={width}>
                    <ComposedChart
                        data={chartData}
                        margin={{
                            top: 40,
                            right: 40,
                            left: -40,
                            bottom: 0,
                        }}
                    >
                        {/* Grid lines for better readability */}
                        <CartesianGrid strokeDasharray="3 3" />

                        {/* X-axis configuration - team member names */}
                        <XAxis
                            dataKey="name"
                            tick={{ fill: '#666', fontSize: 16, fontWeight: 700, dy: 10 }}
                            tickLine={false}
                            axisLine={{ stroke: '#666' }}
                            height={60}
                            interval={0}
                            angle={0}
                            textAnchor="middle"
                        />

                        {/* Y-axis configuration - task counts */}
                        <YAxis
                            tickCount={5}
                            allowDecimals={false}
                            width={80}
                            tick={{ fill: '#666', fontSize: 12 }}
                            tickLine={false}
                            axisLine={{ stroke: '#666' }}
                            tickFormatter={(value) => `${value}`}
                        />

                        {/* Custom tooltip for interactive data display */}
                        <Tooltip content={<CustomTooltip />} />

                        {/* Area chart for upcoming tasks */}
                        <Area
                            type="monotone"
                            dataKey="Tasks Due Next 3 Days"
                            fill="#8884d8"
                            stroke="#8884d8"
                            fillOpacity={0.3}
                        />

                        {/* Bar chart for completed tasks */}
                        <Bar
                            dataKey="Tasks Completed Last 7 Days"
                            activeBar={false}
                            barSize={20}
                            fill="#006400"
                        />

                        {/* Line chart for overdue tasks */}
                        <Line
                            type="monotone"
                            dataKey="Overdue Tasks"
                            stroke="#ff0000"
                            strokeWidth={2}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

ActivitySection.propTypes = {
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired
};

export default ActivitySection;
