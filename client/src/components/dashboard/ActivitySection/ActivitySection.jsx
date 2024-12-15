import { useMemo, useEffect, useState, useRef } from 'react'
import styles from "./ActivitySection.module.css"
import PropTypes from "prop-types"
import { ComposedChart, Bar, XAxis, YAxis, Line, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts'
import getProjectTeamTaskStats from "../../../utils/getProjectTeamTaskStats"
import useTaskService from "../../../services/taskService"
import { useProjectContext } from "../../../context/ProjectContext"
import { useUserContext } from "../../../context/UserContext"

const ActivitySection = ({ height, width }) => {
    const { currentProject } = useProjectContext()
    const { getMultipleUsers, userCache } = useUserContext()
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const taskService = useRef(useTaskService()).current;
    // const userService = useRef(useUserService()).current;

    const teamUserIds = useMemo(() => {
        console.log('teamUserIds memo running');
        return currentProject?.team?.map(member => member.user) ?? [];
    }, [currentProject?.team]);

    useEffect(() => {
        console.log('fetch effect running');
        const fetchData = async () => {
            if (!currentProject?._id || !teamUserIds.length) return;

            try {
                setLoading(true);
                // Fetch tasks and users in parallel
                const [projectTasks] = await Promise.all([
                    taskService.fetchProjectTasks(currentProject._id),
                    getMultipleUsers(teamUserIds)  // This will update userCache for us
                ]);

                setTasks(projectTasks);
                setError(null);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [currentProject?._id, teamUserIds, getMultipleUsers]);

    const chartData = useMemo(() => {
        if (!currentProject?.team || !tasks.length) return [];
        return getProjectTeamTaskStats(currentProject.team, tasks, userCache);
    }, [currentProject?.team, tasks, userCache]);

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>
    if (!tasks.length) return <div>No activity to display.</div>

return (
    <ResponsiveContainer height={height} width={width}>
        <ComposedChart
                data={chartData}
                margin={{
                    top: 25,
                    right: 50,
                    left: -20,
                    bottom: -40,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="name"
                    tick={{ fill: '#666', fontSize: 14 }}
                    tickLine={false}
                    axisLine={{ stroke: '#666' }}
                    height={60}
                />
                <YAxis
                    tickCount={3}
                    allowDecimals={false}
                    width={80}
                    tick={{ fill: '#666', fontSize: 14 }}
                    tickLine={false}
                    axisLine={{ stroke: '#666' }}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Area
                    type="monotone"
                    dataKey="Tasks Due Next 3 Days"
                    fill="#8884d8"
                    stroke="#8884d8"
                    fillOpacity={0.3}
                />
                <Bar dataKey="Tasks Completed Last 7 Days"  activeBar={false} barSize={20} fill="#006400" />
                <Line
                    type="monotone"
                    dataKey="Overdue Tasks"
                    stroke="#ff0000"
                    strokeWidth={2}
                />
                </ComposedChart>
    </ResponsiveContainer>
)
}

ActivitySection.propTypes = {
    height: PropTypes.string,
    width: PropTypes.string
}

export default ActivitySection
