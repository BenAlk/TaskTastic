import PropTypes from "prop-types"
import getUserDm from "../../utils/getUserDm"
import "./styles/QuickDm.css"

const QuickDm = ({ project, userId }) => {

    if (!project) {
        return <div className="quick-dm-container">Loading project data...</div>;
    }

    const userMessages = getUserDm(userId, project)
    
    if (userMessages.length === 0) {
        return (
            <div className="quick-dm-container">
                <div className="no-messages-message">No messages yet.</div>
            </div>
        )
    }

    return (
        <div className="quick-dm-container">
            <div>
                <h3>Unread Direct Messages</h3>
            </div>
            {userMessages.map((message, index) => {

                const senderName= project.team?.members?.find(member => member.id === message.from)?.name
                console.log(senderName)
                return (
                    <div key={index} className="dm-message-container">
                        <div className="dm-message-container-left">
                            <div className="dm-icon"></div>
                            <div className="dm-details">
                                <div className="dm-message-author">{senderName}</div>
                                <div className="dm-message-content">{message.content}</div>
                            </div>
                        </div>
                        <div className="mark-read-icon">
                            ✔
                        </div>
                    </div>
                )
})}
        </div>
    )
}

export default QuickDm

QuickDm.propTypes = {
    project: PropTypes.shape({
        messages: PropTypes.shape({
            directMessages: PropTypes.arrayOf(PropTypes.shape({
                from: PropTypes.number,
                to: PropTypes.number,
                content: PropTypes.string,
                timestamp: PropTypes.string,
                markedRead: PropTypes.bool
            })),
        }),
        team: PropTypes.shape({
            members: PropTypes.arrayOf(PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string,
                role: PropTypes.string
            }))
        })
    }),
    userId: PropTypes.number
}