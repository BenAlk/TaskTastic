import PropTypes from "prop-types"
import getAuthorId from "../../utils/getAuthorId"

const QuickBoard = ({project}) => {
    return (
        <div className="quick-board">
            <h2>Quick Board</h2>
            {project.messages.projectChatBoard.map((message, index) => (
                <div key={index} className="message-board-container">
                    <div className="message-author">{getAuthorId(message.author, project)}</div>
                    <div className="message-content">{message.content}</div>
                    <div className="message-timestamp">{message.timestamp}</div>
                </div>
            ))}
        </div>
    )
}

export default QuickBoard

QuickBoard.propTypes = {
    project: PropTypes.shape({
        messages: PropTypes.shape({
            projectChatBoard: PropTypes.arrayOf(PropTypes.shape({
                author: PropTypes.number,
                content: PropTypes.string,
                timestamp: PropTypes.string
            }))
        }),
        team: PropTypes.shape({
            members: PropTypes.arrayOf(PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string
            }))
        })
    }).isRequired
};