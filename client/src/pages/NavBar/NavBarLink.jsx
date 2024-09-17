
import PropTypes from "prop-types"
const NavBarLink = ({children, icon, isOpen}) => {
    return (
        <div className={`navbar-link-container ${isOpen ? "" : "no-hover"}`}>
            {icon}
            <h2 className={isOpen ? "" : "disabled"}>{children}</h2>
        </div>
    )
}

export default NavBarLink

NavBarLink.propTypes = {
    children: PropTypes.node,
    icon: PropTypes.node,
    isOpen: PropTypes.bool
}