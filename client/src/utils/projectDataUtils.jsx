import dayjs from 'dayjs'

export const createInitialProjectData = () => ({
    projectName: "New Project",
    startDate: dayjs().toDate(),
    targetDate: dayjs().add(1, 'month').toDate(),
    secondaryAdminsAllowed: false,
    eisenhowerEnabled: false,
    kanbanColumns: [
        {
            name: "To Do",
            color: "#E2E8F0", // Light gray default
            maxDays: 0,       // 0 means no limit
            maxTasks: 0,      // 0 means no limit
            order: 0
        },
        {
            name: "In Progress",
            color: "#90CDF4", // Light blue default
            maxDays: 0,
            maxTasks: 0,
            order: 1
        },
        {
            name: "Complete",
            color: "#9AE6B4", // Light green default
            maxDays: 0,
            maxTasks: 0,
            order: 2
        }
    ]
})

export const isValidMember = (member) => {
    return member.name && member.role && member.email
}

export const getEisenhowerQuadrants = () => [
    'urgent-important',
    'urgent-not-important',
    'not-urgent-important',
    'not-urgent-not-important',
]

export const createInitialTaskData = (projectId, currentUser) => ({
    projectId: projectId,
    title: "",
    description: "",
    assignedTo: null,
    kanbanColumn: "",
    eisenhowerQuadrant: null,
    dueDate: null,
    createdBy: currentUser._id,
    createdAt: dayjs().toDate(),
    updatedAt: dayjs().toDate(),
    risk: []
})
