const  getAuthorId = (userId, project) => {
    if (!project || !project.messages || !project.messages.projectChatBoard) {
        return null;
    }

    const author = project.team.members.find(member => member.id === userId)?.name;
    return author;
}

export default getAuthorId;