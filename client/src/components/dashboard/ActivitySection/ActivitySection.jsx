import { useMemo, useEffect, useState, useRef } from 'react'
import styles from "./ActivitySection.module.css"
import PropTypes from "prop-types"
import { ComposedChart, Bar, XAxis, YAxis, Line, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts'
import getProjectTeamTaskStats from "../../../utils/getProjectTeamTaskStats"
import useTaskService from "../../../services/taskService"
import useUserService from "../../../services/usersService"
import { useProjectContext } from "../../../context/ProjectContext"

const ActivitySection = ({ height, width }) => {
    const { currentProject } = useProjectContext()
    console.log('ActivitySection render', {
        projectId: currentProject?._id,
        teamLength: currentProject?.team?.length
    });
    const [tasks, setTasks] = useState([]);
    const [userMap, setUserMap] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const taskService = useRef(useTaskService()).current;
    const userService = useRef(useUserService()).current;


    const teamUserIds = useMemo(() => {
        console.log('teamUserIds memo running', {
            projectId: currentProject?._id,
            team: currentProject?.team
        });
        return currentProject?.team?.map(member => member.user) ?? [];
    }, [currentProject?._id]);

    useEffect(() => {
        console.log('fetch effect running', {
            teamUserIds,
            projectId: currentProject?._id
        });
        const fetchTasks = async () => {
            if (!currentProject?._id) return
            if(!Array.isArray(teamUserIds)) {
                return
            }
            if(teamUserIds.length === 0) return
            try {
                setLoading(true)
                const [projectTasks, users] = await Promise.all([
                    taskService.fetchProjectTasks(currentProject._id),
                    userService.fetchMultipleUsers(teamUserIds)
                ])

                const userDetailsMap = users.reduce((acc, user) => ({
                    ...acc,
                    [user._id]: user
                }), {})

                setTasks(projectTasks)
                setUserMap(userDetailsMap)
                setError(null)
            } catch (error) {
                console.error('Error fetching project tasks:', error)
                setError(error)
            } finally {
                setLoading(false)
            }
        }
        fetchTasks()
    }, [currentProject?._id, teamUserIds])

    const chartData = useMemo(() => {
        if (!currentProject.team || !tasks.length || !Object.keys(userMap).length) return []
        return getProjectTeamTaskStats(currentProject.team, tasks, userMap)
    }, [currentProject?.team, tasks, userMap])

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
