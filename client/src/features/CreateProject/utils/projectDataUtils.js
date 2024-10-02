import dayjs from 'dayjs'

export const createInitialProjectData = (owner = {
    id: 1,
    name: "Test Owner",
    email: "testOwner@hotmail.co.uk",
    avatar: "https://ui-avatars.com/api/?background=ff0000&color=fff&name=Test+Owner",
    role: "Project Manager",
    color: "ff000",
    admin: true,
    pending: false,
}) => ({
    name: "",
    owner: owner.name,
    createdDate: dayjs().format('D MMMM, YYYY'),
    startDate: dayjs(),
    targetDate: dayjs().add(1, 'month'),
    options: {
        enableEisenhower: false,
        enableAdmins: false,
        tbd1: false,
        tbd2: false,
        tbd3: false,
        tbd4: false,
    },
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
