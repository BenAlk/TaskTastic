import styles from "./NavBar.module.css"
import { Link, NavLink } from "react-router-dom"
import { UserIcon, SettingsIcon, TeamIcon, KanbanIcon, TrophyIcon, EnvelopeIcon, EisenhowerIcon, HomeIcon, CollapseIcon, TasksIcon, ImportantIcon } from "../../../assets/icons"
import NavBarLink from "./NavBarLink"
const NavBar = () => {

    const isOpen = true


    return (
        <div className={styles['navbar-container']}>
            <Link to="/" className={styles['title-link']}>
                <h1>TaskTastic</h1>
            </Link>
            <div className={styles['navbar-head']}>
                <UserIcon className={styles['user-icon']}/>
                <h2 className={styles['user-name']}>Ben Alkureishi</h2>
                <h3 className={styles['user-position']}>Front-End Developer</h3>
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

                <NavLink to="/achievements" className={({isActive}) => isActive ? styles['active'] : ''}>
                    {({isActive}) => (
                        <NavBarLink isOpen={isOpen} icon={<TrophyIcon className={styles['nav-link-icon']} />} isActive={isActive}>
                            Achievements
                        </NavBarLink>
                    )}
                </NavLink>

                <NavLink to="/settings" className={({isActive}) => isActive ? styles['active'] : ''}>
                    {({isActive}) => (
                        <NavBarLink isOpen={isOpen} icon={<SettingsIcon className={styles['nav-link-icon']} />} isActive={isActive}>
                            Settings
                        </NavBarLink>
                    )}
                </NavLink>
            </div>
        </div>
    );
};

export default NavBar;
