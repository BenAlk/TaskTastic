import PropTypes from "prop-types"
import "./styles/Card.css"

const Card = ({children, className}) => {
    return (
        <div className={`card-container ${className}`}>
            <div className="card-content">
                {children}
            </div>
        </div>
    )
}

export default Card

Card.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
}