import { subDays, parseISO, isAfter, isBefore } from 'date-fns';

const getProjectTeamTaskStats = (project) => {
const today = new Date();
const threeDaysFromNow = subDays(today, -3);
const sevenDaysAgo = subDays(today, 7);

const teamStats = project.team.map(member => {
    const memberTasks = project.tasks.filter(task => task.assignedTo === member.name);

    const overdueTaskCount = memberTasks.filter(task => {
    const targetDate = parseISO(task.targetDate);
        return isBefore(targetDate, today) && !task.completedDate;
    }).length;

    const tasksDueNextThreeDays = memberTasks.filter(task => {
    const targetDate = parseISO(task.targetDate);
        return isAfter(targetDate, today) && isBefore(targetDate, threeDaysFromNow) && !task.completedDate;
    }).length;

    const tasksCompletedLastSevenDays = memberTasks.filter(task => {
    const completedDate = task.completedDate ? parseISO(task.completedDate) : null;
        return completedDate && isAfter(completedDate, sevenDaysAgo) && isBefore(completedDate, today);
    }).length;

    return {
        name: member.name,
        "Overdue Tasks": overdueTaskCount,
        "Tasks Due Next 3 Days": tasksDueNextThreeDays,
        "Tasks Completed Last 7 Days": tasksCompletedLastSevenDays
    };
});

return teamStats;
};

export default getProjectTeamTaskStats;
