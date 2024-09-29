export const createMemberTemplate = () => ({
    name: "",
    role: "",
    email: "",
    customColor: "",
    added: false, // Changed from string to boolean for clarity
    avatar: ""
});

export const isValidMember = (member) => {
    return (
    typeof member.name === 'string' &&
    typeof member.role === 'string' &&
    typeof member.email === 'string' &&
    typeof member.customColor === 'string' &&
    typeof member.added === 'boolean' &&
    typeof member.avatar === 'string'
    );
};
