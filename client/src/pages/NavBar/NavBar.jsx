import { UserIcon, SettingsIcon, TeamIcon, KanbanIcon, TrophyIcon, EnvelopeIcon, EisenhowerIcon, HomeIcon, CollapseIcon, TasksIcon } from "../../assets/icons"
import NavBarLink from "./NavBarLink"
import "./styles/NavBar.css"
import PropTypes from "prop-types"
import { Link, NavLink } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import { LayoutContext } from "../Layout/index"

const user = {
    name: "Ben Alkureishi",
    position: "Front-End Developer"
}

const NavBar = ({isOpen, handleMenuToggle}) => {
    const { errors, setErrors } = useContext(LayoutContext);
    const [localErrors, setLocalErrors] = useState({})

    useEffect(() => {
        setLocalErrors(errors);
    }, [errors]);

    useEffect(() => {
        const timer = setTimeout(() => {
            const updatedErrors = { ...localErrors };
            let hasChanges = false;

            Object.keys(updatedErrors).forEach(key => {
                if (!errors[key]) {
                    delete updatedErrors[key];
                    hasChanges = true;
                }
            });

            if (hasChanges) {
                setLocalErrors(updatedErrors);
                setErrors(updatedErrors);
            }
        }, 100);  // Small delay to ensure all updates have processed

        return () => clearTimeout(timer);
    }, [errors, localErrors, setErrors]);

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
                <NavLink to="/"><NavBarLink isOpen={isOpen} icon={<HomeIcon className="nav-link-icon" />}>Dashboard</NavBarLink></NavLink>
                <NavBarLink isOpen={isOpen} icon={<TasksIcon className="nav-link-icon" />}>Tasks</NavBarLink>
                <NavBarLink isOpen={isOpen} icon={<KanbanIcon className="nav-link-icon" />}>Kanban</NavBarLink>
                <NavBarLink isOpen={isOpen} icon={<EisenhowerIcon className="nav-link-icon" />}>Eisenhower</NavBarLink>
                <NavBarLink isOpen={isOpen} icon={<TeamIcon className="nav-link-icon"/>}>Team</NavBarLink>
                <NavBarLink isOpen={isOpen} icon={<EnvelopeIcon className="nav-link-icon" />}>Messages</NavBarLink>
                <NavBarLink isOpen={isOpen} icon={<TrophyIcon className="nav-link-icon" />}>Achievements</NavBarLink>
                <NavBarLink isOpen={isOpen} icon={<SettingsIcon className="nav-link-icon"/>}>Settings</NavBarLink>
            </div>
            {Object.keys(localErrors).length > 0 && (
                <div className="errors-container">
                    {Object.entries(localErrors).map(([key, value]) => (
                        <div key={key} className="error-item">
                            {value}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default NavBar

NavBar.propTypes = {
    isOpen: PropTypes.bool,
    handleMenuToggle: PropTypes.func
}
