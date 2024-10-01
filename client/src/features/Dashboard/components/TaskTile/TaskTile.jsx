import { useMemo } from 'react';
import PropTypes from "prop-types";
import "./styles/TaskTile.css";
import { BarChart, Tooltip, XAxis, YAxis, CartesianGrid, Bar, ResponsiveContainer } from 'recharts';

const TaskTile = ({ project, height, width }) => {
    const chartData = useMemo(() => {
        const columnCounts = Object.fromEntries(
        project.kanban.map(column => [column.name, 0])
        );

        project.tasks.forEach(task => {
        if (Object.prototype.hasOwnProperty.call(columnCounts, task.kanbanColumn)) {
            columnCounts[task.kanbanColumn]++;
        }
        });

        return project.kanban.map(column => ({
        name: column.name,
        tasks: columnCounts[column.name],
        fill: column.color
        }));
    }, [project]);

        return (
        <ResponsiveContainer height={height} width={width}>
            <h2 className="tile-title">Task Progress</h2>
            <BarChart
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
            <Bar dataKey="tasks" activeBar={false} />
            </BarChart>
        </ResponsiveContainer>
        );

};

TaskTile.propTypes = {
project: PropTypes.shape({
    projectName: PropTypes.string.isRequired,
    kanban:PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired
    })).isRequired,
    tasks: PropTypes.arrayOf(PropTypes.shape({
    kanbanColumn: PropTypes.string.isRequired
    })).isRequired
}),
height: PropTypes.string,
width: PropTypes.string
}

export default TaskTile;
