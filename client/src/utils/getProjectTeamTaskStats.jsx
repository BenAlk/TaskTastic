import { subDays, parseISO, isAfter, isBefore } from 'date-fns';

const getProjectTeamTaskStats = (team, tasks, userMap) => {
const today = new Date();
const threeDaysFromNow = subDays(today, -3);
const sevenDaysAgo = subDays(today, 7);

const teamStats = team.map(member => {
    const userName = userMap[member.user]?.firstName || 'Unknown User'
    const memberTasks = tasks.filter(task => task.assignedTo === member.user);

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
        name: userName,
        "Overdue Tasks": overdueTaskCount,
        "Tasks Due Next 3 Days": tasksDueNextThreeDays,
        "Tasks Completed Last 7 Days": tasksCompletedLastSevenDays
    };
});

return teamStats;
};

export default getProjectTeamTaskStats;
