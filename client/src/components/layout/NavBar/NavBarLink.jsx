import PropTypes from "prop-types"
import styles from "./NavBar.module.css"

const NavBarLink = ({children, icon, isOpen, isActive}) => {
    return (
        <div className={`${styles['navbar-link-container']} ${isOpen ? "" : styles['no-hover']} ${isActive ? styles['active-link'] : ""}`}>
            {icon}
            <h2 className={isOpen ? "" : styles['disabled']}>{children}</h2>
        </div>
    )
}

export default NavBarLink

NavBarLink.propTypes = {
    children: PropTypes.node,
    icon: PropTypes.node,
    isOpen: PropTypes.bool,
    isActive: PropTypes.bool
}
