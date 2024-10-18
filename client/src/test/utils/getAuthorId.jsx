const  getAuthorId = (userId, project) => {
    if (!project || !project.messages || !project.messages.projectChatBoard) {
        return null;
    }

    const author = project.team.find(member => member.id === userId)?.name;
    return author
    .split(' ')
    .map(name => name[0].toUpperCase())
    .join('');
}

export default getAuthorId;
