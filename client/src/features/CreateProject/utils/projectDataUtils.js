import dayjs from 'dayjs'

export const createInitialProjectData = (owner) => ({
    name: "",
    owner: owner.name,
    createdDate: dayjs().format('D MMMM, YYYY'),
    startDate: dayjs(),
    targetDate: dayjs().add(1, 'month'),
    tasks: [],
    kanban: [],
    team: [
        {
            id: owner.id,
            name: owner.name,
            role: owner.role,
            email: owner.email,
            color: owner.color,
            avatar: owner.avatar,
            admin: owner.admin,

        }
    ],
    messages: {
        directMessages: [],
        projectChatBoard: [],
    },
    risks: [],
})

export const isValidMember = (member) => {
    return member.name && member.role && member.email
}
