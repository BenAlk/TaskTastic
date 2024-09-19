import { useMemo } from 'react';
import PropTypes from "prop-types";
import "./styles/TaskTile.css";
import { BarChart, Tooltip, XAxis, YAxis, CartesianGrid, Bar, ResponsiveContainer } from 'recharts';

const TaskTile = ({ project }) => {
const chartData = useMemo(() => {
    const columnCounts = Object.fromEntries(
    project.kanban.columns.map(column => [column.name, 0])
    );

    project.tasks.forEach(task => {
    if (Object.prototype.hasOwnProperty.call(columnCounts, task.kanbanColumn)) {
        columnCounts[task.kanbanColumn]++;
    }
    });

    return project.kanban.columns.map(column => ({
    name: column.name,
    tasks: columnCounts[column.name],
    fill: column.color  // Changed 'color' to 'fill' to match Recharts expectations
    }));
}, [project]);

return (
    <ResponsiveContainer>
        <h2 className="tile-title">Task Activity</h2>
    <BarChart
        data={chartData}
        margin={{
        top: 70,
        right: 90,
        left: 0,
        bottom: -20,
        }}
    >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis 
        dataKey="name" 
        height={60}
        tick={{fill: '#666', fontSize: 14}}
        tickLine={false}
        axisLine={{stroke: '#666'}}
    />
    <YAxis
        domain={[0, maxTasks => Math.max(Math.ceil(maxTasks * 1))]}
        tickCount={3}
        allowDecimals={false}
        width={80}
        tick={{fill: '#666', fontSize: 14}}
        tickLine={false}
        axisLine={{stroke: '#666'}}
        tickFormatter={(value) => `${value}`}
    />
    <Tooltip cursor={{ fill: 'transparent' }} />
    <Bar dataKey="tasks" activeBar={false} />
    </BarChart>
    </ResponsiveContainer>
);
}

TaskTile.propTypes = {
project: PropTypes.shape({
    projectName: PropTypes.string.isRequired,
    kanban: PropTypes.shape({
    columns: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired
    })).isRequired
    }).isRequired,
    tasks: PropTypes.arrayOf(PropTypes.shape({
    kanbanColumn: PropTypes.string.isRequired
    })).isRequired
}).isRequired
}

export default TaskTile;