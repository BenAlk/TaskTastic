import PropTypes from "prop-types"
import QuickDm from "./QuickDm/QuickDm"
import QuickBoard from "./QuickBoard/QuickBoard"
import "./styles/MessageTile.css"

const loggedInUser = 5

const MessageTile = ({ project }) => {

    return (
        <div className="message-tile">
            <div className="message-tile-header">
                <h2>Messages</h2>
            </div>
            <QuickDm project={project} userId={loggedInUser}/>
            <QuickBoard projectChatBoard={project.messages.projectChatBoard} project={project} />
        </div>
    )
}

export default MessageTile

MessageTile.propTypes = {
    project: PropTypes.shape({
        messages: PropTypes.shape({

            directMessages: PropTypes.arrayOf(PropTypes.shape({
                from: PropTypes.number,
                to: PropTypes.number,
                content: PropTypes.string,
                timestamp: PropTypes.string,
                markedRead: PropTypes.bool
            })),
            projectChatBoard: PropTypes.arrayOf(PropTypes.shape({
                author: PropTypes.number,
                content: PropTypes.string,
                timestamp: PropTypes.string
            }))
        })
    })
}
