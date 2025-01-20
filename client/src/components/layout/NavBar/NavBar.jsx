import styles from "./NavBar.module.css"
import { useState, useEffect } from "react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { UserIcon, SettingsIcon, TeamIcon, KanbanIcon, TrophyIcon, EnvelopeIcon, EisenhowerIcon, HomeIcon, TasksIcon} from "../../../assets/icons"
import NavBarLink from "./NavBarLink"
import { useAuth } from "../../../context/AuthContext"
import { useProjectContext } from "../../../context/ProjectContext"

const NavBar = () => {
    const { currentUser, logout } = useAuth()
    const { currentProject } = useProjectContext()
    const navigate = useNavigate()
    const isOpen = true
    const [role, setRole] = useState(null)

    useEffect(() => {
        if (!currentProject) {
            setRole('\u00A0')
            return
        }

        if (currentProject?.projectOwner === currentUser._id) {
            setRole('Project Leader')
        } else {
            const teamMember = currentProject?.team.find(member => member.user === currentUser._id)
            const role = teamMember?.role || ' '
            const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1)
            setRole(capitalizedRole)
        }
    }, [currentProject, currentUser._id])

    const handleLogout = () => {
        logout()
        navigate('/login')
    };


    return (
        <div className={styles['navbar-container']}>
            <div className={styles['navbar-head']}>
            <Link to="/" className={styles['title-link']}>
                <h1>TaskTastic</h1>
            </Link>
                <UserIcon className={styles['user-icon']}/>
                <h2 className={styles['user-name']}>{`${currentUser.firstName} ${currentUser.lastName}`}</h2>
                <h3 className={styles['user-position']}>{role}</h3>
            </div>
            <div className={styles['navbar-links']}>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles['active'] : ''}>
                    {({ isActive }) => (
                        <NavBarLink isOpen={isOpen} icon={<HomeIcon className={styles['nav-link-icon']} />} isActive={isActive}>
                            Dashboard
                        </NavBarLink>
                    )}
                </NavLink>

                <NavLink to="/tasks" className={({isActive}) => isActive ? styles['active'] : ''}>
                    {({isActive}) => (
                        <NavBarLink isOpen={isOpen} icon={<TasksIcon className={styles['nav-link-icon']} />} isActive={isActive}>
                            Tasks
                        </NavBarLink>
                    )}
                </NavLink>

                <NavLink to="/kanban" className={({isActive}) => isActive ? styles['active'] : ''}>
                    {({isActive}) => (
                        <NavBarLink isOpen={isOpen} icon={<KanbanIcon className={styles['nav-link-icon']} />} isActive={isActive}>
                            Kanban
                        </NavBarLink>
                    )}
                </NavLink>

                <NavLink to="/eisenhower" className={({isActive}) => isActive ? styles['active'] : ''}>
                    {({isActive}) => (
                        <NavBarLink isOpen={isOpen} icon={<EisenhowerIcon className={styles['nav-link-icon']} />} isActive={isActive}>
                            Eisenhower
                        </NavBarLink>
                    )}
                </NavLink>

                <NavLink to="/team" className={({isActive}) => isActive ? styles['active'] : ''}>
                    {({isActive}) => (
                        <NavBarLink isOpen={isOpen} icon={<TeamIcon className={styles['nav-link-icon']} />} isActive={isActive}>
                            Team
                        </NavBarLink>
                    )}
                </NavLink>

                <NavLink to="/messages" className={({isActive}) => isActive ? styles['active'] : ''}>
                    {({isActive}) => (
                        <NavBarLink isOpen={isOpen} icon={<EnvelopeIcon className={styles['nav-link-icon']} />} isActive={isActive}>
                            Messages
                        </NavBarLink>
                    )}
                </NavLink>

                <div className={styles['tooltip-wrapper']}>
                    <NavLink
                        to="/achievements"
                        className={`${styles['inactive-nav-link']} ${({isActive}) => isActive ? styles['active'] : ''}`}
                        onClick={(e) => e.preventDefault()}
                    >
                        {({isActive}) => (
                            <NavBarLink isOpen={isOpen} icon={<TrophyIcon className={styles['nav-link-icon']} />} isActive={isActive}>
                                Achievements
                            </NavBarLink>
                        )}
                    </NavLink>
                </div>

                <NavLink to="/settings" className={({isActive}) => isActive ? styles['active'] : ''}>
                    {({isActive}) => (
                        <NavBarLink isOpen={isOpen} icon={<SettingsIcon className={styles['nav-link-icon']} />} isActive={isActive}>
                            Settings
                        </NavBarLink>
                    )}
                </NavLink>
            </div>
            <div
            onClick={handleLogout}
            className={styles['logout-button']}
            role="button"
            tabIndex={0}
        >
            Logout
            </div>
        </div>
    )
}

export default NavBar
