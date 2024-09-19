import { PieChart } from '@mui/x-charts/PieChart';
import PropTypes from "prop-types";

const PieChartTasks = ({project}) => {
    const isOverdue = (task) => {
        const today = new Date();
        const targetDate = new Date(task.targetDate);
        return targetDate < today && task.kanbanColumn !== 'Done';
    };

    const isDueSoon = (task) => {
        const today = new Date();
        const targetDate = new Date(task.targetDate);
        const differenceInDays = (targetDate - today) / (1000 * 3600 * 24);
        return differenceInDays > 0 && differenceInDays <= 7 && task.kanbanColumn !== 'Done';
    };

    const isCompletedThisWeek = (task) => {
        const today = new Date();
        const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const completedDate = new Date(task.completedDate);
        return task.kanbanColumn === 'Done' && completedDate > oneWeekAgo && completedDate <= today;
    };

    // Ensure project.tasks is an array before filtering
    const tasks = Array.isArray(project.tasks) ? project.tasks : [];

    const overdueTasks = tasks.filter(isOverdue);
    const dueSoonTasks = tasks.filter(isDueSoon).length;
    const completedThisWeek = tasks.filter(isCompletedThisWeek).length;

    const overdueCount = overdueTasks.reduce((acc, task) => {
        if (task.assignedTo) {
            acc[task.assignedTo] = (acc[task.assignedTo] || 0) + 1;
        }
        return acc;
    }, {});

    // Create the overdue label with counts
    const overdueLabel = Object.entries(overdueCount)
        .map(([member, count]) => `${member} (${count})`)
        .join(', \n');

    const finalOverdueLabel = overdueLabel ? overdueLabel : 'Overdue: None';

    const data = [
        { id: 0, value: overdueTasks.length, label: overdueLabel, color: '#ff0000' },
        { id: 1, value: dueSoonTasks, label: 'Due Soon', color: '#add8e6' },
        { id: 2, value: completedThisWeek, label: 'Completed This Week', color: '#00ff00' },
        // { id: 3, value: null, label: finalOverdueLabel, color: '#ffffff' }
    ];

    return (
        <>
            <h2>{project.projectName} - Task Activity</h2>
            {data.some(item => item.value > 0) ? (
                <PieChart
                margin={{ top: 25, right: 25, bottom: 100, left: 25 }}
                    series={[
                        {
                            data,
                            highlightScope: { faded: 'global', highlighted: 'item' },
                            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                        },
                    ]}
                    slotProps={{
                        legend: {
                            // direction: 'row',
                            // position: { vertical: 'bottom', horizontal: 'middle' },
                            // padding: 35,
                            // labelStyle: { fontSize: 12 },
                            hidden: true
                        },
                    }}
                />
            ) : (
                <p>No task data available to display.</p>
            )}
        </>
    );
}

export default PieChartTasks;

PieChartTasks.propTypes = {
    project: PropTypes.shape({
        projectName: PropTypes.string.isRequired,
        tasks: PropTypes.arrayOf(PropTypes.shape({
            targetDate: PropTypes.string.isRequired,
            kanbanColumn: PropTypes.string.isRequired,
            assignedTo: PropTypes.string,
            completedDate: PropTypes.string,
        })).isRequired,
    }).isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
};