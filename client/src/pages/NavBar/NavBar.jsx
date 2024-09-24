import { UserIcon, SettingsIcon, TeamIcon, KanbanIcon, TrophyIcon, ProjectsIcon, EnvelopeIcon, EisenhowerIcon, HomeIcon, CollapseIcon, TasksIcon } from "../../assets/icons"
import NavBarLink from "./NavBarLink"
import "./styles/NavBar.css"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"

const user = {
    name: "Ben Alkureishi",
    position: "Front-End Developer"
}

const NavBar = ({isOpen, handleMenuToggle}) => {
    return (
        <div className={`navbar-container ${isOpen ? "" : "collapsed"}`}>
            <div className="collapse-container" onClick={handleMenuToggle} title={isOpen ? "Collapse Menu" : "Expand Menu"}>
            <CollapseIcon className={`collapse-icon ${isOpen ? "" : "rotate180"}`} />
            </div>
            <Link to="/" className={`title-link ${isOpen ? "expanded" : "disabled"}`}>
                    <h1>TaskTastic</h1>
            </Link>
            <div className="navbar-head">
                <UserIcon className={`user-icon ${isOpen ? "" : "scaled"}`}/>
                <h2 className={`user-name ${isOpen ? "" : "disabled"}`}>{user.name}</h2>
                <h3 className={`user-position ${isOpen ? "" : "disabled"}`}>{user.position}</h3>
            </div>
            <div className={`navbar-links ${isOpen ? "" : "slide-up"}`}>
                <NavBarLink isOpen={isOpen} icon={<HomeIcon className="nav-link-icon" />}>Dashboard</NavBarLink>
                <NavBarLink isOpen={isOpen} icon={<ProjectsIcon className="nav-link-icon" />}>Projects</NavBarLink>
                <NavBarLink isOpen={isOpen} icon={<TasksIcon className="nav-link-icon" />}>Tasks</NavBarLink>
                <NavBarLink isOpen={isOpen} icon={<KanbanIcon className="nav-link-icon" />}>Kanban</NavBarLink>
                <NavBarLink isOpen={isOpen} icon={<EisenhowerIcon className="nav-link-icon" />}>Projects</NavBarLink>
                <NavBarLink isOpen={isOpen} icon={<TeamIcon className="nav-link-icon"/>}>Team</NavBarLink>
                <NavBarLink isOpen={isOpen} icon={<EnvelopeIcon className="nav-link-icon" />}>Messages</NavBarLink>
                <NavBarLink isOpen={isOpen} icon={<TrophyIcon className="nav-link-icon" />}>Achievements</NavBarLink>
                <NavBarLink isOpen={isOpen} icon={<SettingsIcon className="nav-link-icon"/>}>Settings</NavBarLink>
            </div>
        </div>
    )
}

export default NavBar

NavBar.propTypes = {
    isOpen: PropTypes.bool,
    handleMenuToggle: PropTypes.func
}