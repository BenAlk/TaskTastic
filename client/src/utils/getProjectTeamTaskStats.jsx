import { subDays, addDays, parseISO, isAfter, isBefore } from 'date-fns';
const getProjectTeamTaskStats = (team, tasks, userMap) => {

    const today = new Date();
    const threeDaysFromNow = addDays(today, 3);
    const sevenDaysAgo = subDays(today, 7);

    const safeParseDate = (dateString) => {
        try {
            if (!dateString) return null;
            return parseISO(dateString);
        } catch (error) {
            console.warn('Date parsing failed for:', dateString);
            return null;
        }
    };

    const teamStats = team.map(member => {
        const userName = userMap[member.user]?.firstName || 'Unknown User';
        const memberTasks = tasks.filter(task => task?.assignedTo === member.user);
        const overdueTaskCount = memberTasks.filter(task => {
            const dueDate = safeParseDate(task.dueDate);
            return dueDate && isBefore(dueDate, today) && !task.completedDate;
        }).length;

        const tasksDueNextThreeDays = memberTasks.filter(task => {
            const dueDate = safeParseDate(task.dueDate);
            return dueDate &&
                isAfter(dueDate, today) &&
                isBefore(dueDate, threeDaysFromNow) &&
                !task.completedDate;
        }).length;

        const tasksCompletedLastSevenDays = memberTasks.filter(task => {
            const completedDate = safeParseDate(task.completedDate);
            return completedDate &&
                isAfter(completedDate, sevenDaysAgo) &&
                isBefore(completedDate, today);
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
