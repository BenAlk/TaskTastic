import PropTypes from "prop-types";
import { ComposedChart, Bar, XAxis, YAxis, Line, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';
import useKanbanStats from "../../../utils/useKanbanStats"
import { useProjectContext } from "../../../context/ProjectContext"

const TaskSection = ({ height, width}) => {
    const { currentProject } = useProjectContext()
    const { columnStats, loading, error, refreshStats } = useKanbanStats(currentProject)

    if (loading) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <ResponsiveContainer height={height} width={width}>
            <h2 className="tile-title">Team Activity</h2>
            <ComposedChart
                data={columnStats}
                margin={{
                    top: 0,
                    right: 50,
                    left: -20,
                    bottom: -20,
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

export default TaskSection

TaskSection.propTypes = {
    height: PropTypes.string,
    width: PropTypes.string
}
