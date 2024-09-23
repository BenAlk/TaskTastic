import { useMemo } from 'react'
import PropTypes from "prop-types"
import "./styles/ActivityTile.css"
import { ComposedChart, Bar, XAxis, YAxis, Line, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts'
import getProjectTeamTaskStats from '../../utils/getProjectTeamTaskStats'

    const ActivityTile = ({ project, height, width }) => {
        const chartData = useMemo(() => {
            return getProjectTeamTaskStats(project);
        }, [project]);



    return (
        <ResponsiveContainer height={height} width={width}>
            <h2 className="tile-title">Team Activity</h2>
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
        }))
    }),
    height: PropTypes.string,
    width: PropTypes.string
    }

export default ActivityTile


