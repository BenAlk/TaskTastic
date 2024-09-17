import PropTypes from "prop-types"

const DropdownLabel = ({children, styling = {}}) => {
    return (
        <div className="dropdown-label" style={styling}>
            {children}
        </div>
    )
}

DropdownLabel.propTypes = {
    children: PropTypes.node.isRequired,
    styling: PropTypes.object
}

export default DropdownLabel