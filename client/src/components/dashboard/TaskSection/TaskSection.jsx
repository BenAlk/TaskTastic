import { useState, useEffect } from 'react';
import PropTypes from "prop-types";
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
import { useProjectContext } from "../../../context/ProjectContext";
import { useTaskContext } from "../../../context/TaskContext";
import { addDays, subDays, parseISO } from 'date-fns';

const TaskSection = ({ height, width }) => {
    // Step 1: Set up our data sources and state management
    // Think of this like gathering all our tools before starting work
    const { currentProject } = useProjectContext();
    const { tasks, loading: tasksLoading, fetchTasks } = useTaskContext();
    const [chartData, setChartData] = useState([]);
    const [error, setError] = useState(null);

    // Step 2: Fetch tasks when the project changes
    // Like requesting updated information when we switch to a different project
    useEffect(() => {
        if (!currentProject?._id) return;

        console.log('Fetching tasks for project:', currentProject._id);
        fetchTasks(currentProject._id);
    }, [currentProject?._id]);

    // Step 3: Process tasks into chart data
    // This is where we organize our task information into a format the chart can understand
    useEffect(() => {
        console.log('Starting data processing:', {
            tasksCount: tasks?.length,
            columnsCount: currentProject?.kanbanColumns?.length,
            sampleTask: tasks?.[0],
            sampleColumn: currentProject?.kanbanColumns?.[0]
        });

        // Only proceed if we have both columns and tasks to work with
        if (!currentProject?.kanbanColumns || !tasks?.length) {
            console.log('Missing required data, skipping processing');
            setChartData([]);
            return;
        }

        try {
            const today = new Date();
            const threeDaysFromNow = addDays(today, 3);
            const sevenDaysAgo = subDays(today, 7);

            // Initialize our data structure with a total count
            const columnStats = currentProject.kanbanColumns.map(column => ({
                name: column.name,
                color: column.color,
                "Total Tasks": 0,  // Add this as our main metric
                "Tasks Due Next 3 Days": 0,
                "Tasks Completed Last 7 Days": 0,
                "Overdue Tasks": 0
            }));

            // Process tasks
            tasks.forEach(task => {
                const columnIndex = columnStats.findIndex(
                    column => column._id.toString() === task.kanbanColumnId.toString()
                );

                if (columnIndex === -1) return;

                // Increment total count for this column
                columnStats[columnIndex]["Total Tasks"]++;

                const dueDate = task.dueDate ? parseISO(task.dueDate) : null;
                const completedDate = task.completedDate ? parseISO(task.completedDate) : null;

                // Update other metrics as before
                if (dueDate) {
                    if (dueDate >= today && dueDate <= threeDaysFromNow && !completedDate) {
                        columnStats[columnIndex]["Tasks Due Next 3 Days"]++;
                    }
                    if (dueDate < today && !completedDate) {
                        columnStats[columnIndex]["Overdue Tasks"]++;
                    }
                }

                if (completedDate && completedDate >= sevenDaysAgo && completedDate <= today) {
                    columnStats[columnIndex]["Tasks Completed Last 7 Days"]++;
                }
            });

            console.log('Processed column stats:', columnStats);
            setChartData(columnStats);

        } catch (err) {
            console.error('Error in calculation:', err);
            setError('Failed to process task statistics');
        }
    }, [currentProject?.kanbanColumns, tasks]);

    // Step 5: Render our chart
    return (
        <div>
            <h2 className="tile-title">Task Status Overview</h2>
            <ResponsiveContainer width={width} height={height}>
                <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="name"
                        tick={{ fill: '#666', fontSize: 14 }}
                        tickLine={false}
                        axisLine={{ stroke: '#666' }}
                    />
                    <YAxis
                        tickCount={5}
                        allowDecimals={false}
                        tick={{ fill: '#666', fontSize: 14 }}
                        tickLine={false}
                        axisLine={{ stroke: '#666' }}
                    />
                    {/* Main bar showing total tasks */}
                    <Bar
                        dataKey="Total Tasks"
                        fill={(entry) => entry.color || '#8884d8'}  // Use column color
                        barSize={60}
                    >
                    </Bar>

                    {/* Custom tooltip to show additional metrics */}
                    <Tooltip
                        content={({ active, payload }) => {
                            if (!active || !payload?.length) return null;

                            const data = payload[0].payload;
                            return (
                                <div style={{
                                    backgroundColor: 'white',
                                    padding: '10px',
                                    border: '1px solid #ccc'
                                }}>
                                    <p><strong>{data.name}</strong></p>
                                    <p>Total Tasks: {data["Total Tasks"]}</p>
                                    <p>Due Soon: {data["Tasks Due Next 3 Days"]}</p>
                                    <p>Overdue: {data["Overdue Tasks"]}</p>
                                    <p>Recently Completed: {data["Tasks Completed Last 7 Days"]}</p>
                                </div>
                            );
                        }}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}

TaskSection.propTypes = {
    height: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired
};

export default TaskSection;
