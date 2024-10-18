import PropTypes from "prop-types"
import getAuthorId from "../../../../../utils/getAuthorId"
import "./styles/QuickBoard.css"
import { ImportantIcon } from "../../../../../assets/icons"

const QuickBoard = ({project}) => {

    const sortedMessages = [...project.messages.projectChatBoard].sort((a, b) =>
        new Date(b.timestamp) - new Date(a.timestamp)
    );

    const handleAcknowledgeMessage = (message) => {
        message.acknowledged = true;
    }

    return (
        <div className="quick-board-container">
            <div className="quick-board-header">
                <h3>Quick Board</h3>
            </div>
            <div className="quick-board">
            {sortedMessages.map((message, index) => (
                    <div key={index} className="quick-board-message-container">
                        <div className="message-author">{getAuthorId(message.author, project)}</div>
                        <div className="message-header">
                            <div className="message-summary">{message.summary}</div>
                        </div>
                        <div className="message-body">
                            <div className="message-content slim-scroll"><p>{message.content}</p></div>
                            </div>
                        <div className="message-foot">
                            <div className="message-timestamp">{new Date(message.timestamp).toLocaleString(undefined, {
                                        day: 'numeric',
                                        month: 'short',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })
                                }
                                <div className="message-foot-icons">
                                    {message.important &&<div className="important-icon" title="Important Message"><ImportantIcon height="15px" width="15px" /></div>}
                                    <div className={`thumbs-up-icon ${message.acknowledged && "acknowledged"}`} title="Acknowledge Message" onClick={handleAcknowledgeMessage}>✔</div>
                                </div>
                            </div>
                        </div>
                    </div>
            ))}
            </div>
        </div>
    )
}

export default QuickBoard

QuickBoard.propTypes = {
    project: PropTypes.shape({
        messages: PropTypes.shape({
            projectChatBoard: PropTypes.arrayOf(PropTypes.shape({
                author: PropTypes.number,
                summary: PropTypes.string,
                content: PropTypes.string,
                timestamp: PropTypes.string,
                important: PropTypes.bool,
                acknowledged: PropTypes.bool
            }))
        }),
        team: PropTypes.arrayOf(PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string
            }))
    }).isRequired
};
