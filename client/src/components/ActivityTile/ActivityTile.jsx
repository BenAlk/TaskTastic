import { useMemo } from 'react'
import PropTypes from "prop-types"
import "./styles/ActivityTile.css"
import { ComposedChart, Bar, XAxis, YAxis, Line, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts'
import getProjectTeamTaskStats from '../../utils/getProjectTeamTaskStats'

    const ActivityTile = ({ project }) => {
        const chartData = useMemo(() => {
            return getProjectTeamTaskStats(project);
        }, [project]);

console.log(chartData)

    return (
        <ResponsiveContainer>
            <h2 className="tile-title">Team Activity</h2>
            <ComposedChart
                data={chartData}
                margin={{
                    top: 20,
                    right: 20,
                    left: 20,
                    bottom: 20,
                }}
                >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#666', fontSize: 14 }} 
                    tickLine={false} 
                    axisLine={{ stroke: '#666' }} 
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
                    dataKey="tasksDueNextThreeDays" 
                    fill="#8884d8" 
                    stroke="#8884d8"
                    fillOpacity={0.3} 
                />
                <Bar dataKey="tasksCompletedLastSevenDays"  activeBar={false} barSize={20} fill="#90EE90" />
                <Line
                    type="monotone" 
                    dataKey="overdueTaskCount"
                    stroke="#ff0000"
                />
                </ComposedChart>
        </ResponsiveContainer>
    )
}

export default ActivityTile

ActivityTile.propTypes = {
project: PropTypes.shape({
    projectName: PropTypes.string.isRequired,
    team: PropTypes.shape({
        members: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            role: PropTypes.string.isRequired,
        })).isRequired
    }).isRequired,
    tasks: PropTypes.arrayOf(PropTypes.shape({
        assignedTo: PropTypes.string.isRequired,
        targetDate: PropTypes.string.isRequired,
        completedDate: PropTypes.string,
    })).isRequired,
})
}
