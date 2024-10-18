export const createMemberTemplate = () => ({
    id: 0,
    name: "",
    role: "",
    email: "",
    color: "",
    avatar: "",
    pending: true,
    admin: false
});

export const isValidMember = (member) => {
    return (
    typeof member.name === 'string' &&
    typeof member.role === 'string' &&
    typeof member.email === 'string' &&
    typeof member.color === 'string' &&
    typeof member.avatar === 'string' &&
    typeof member.pending === 'boolean' &&
    typeof member.admin === 'boolean'
    );
};
