const getUserDm = (userId, project) => {

    if (!project || !project.messages || !project.messages.directMessages) {
        return [];
    }

    // Filter messages received by the user
    const dmsForUser = project.messages.directMessages.filter(dm => dm.to === userId && dm.markedRead !== true);
    return dmsForUser;
};

export default getUserDm;

