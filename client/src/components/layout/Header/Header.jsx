import styles from "./Header.module.css"
import { Link } from "react-router-dom"
import {useAuth} from "../../../context/AuthContext"
import ProjectSelector from "./ProjectSelector/ProjectSelector"
const Header = () => {
    const { currentUser } = useAuth()

    return (
        <div className={styles['header-container']}>
            <div className={styles['welcome-container']}>Welcome back,{currentUser.name ? currentUser.name : (<Link to="/settings" className={styles['complete-profile-link']}>Click here to complete your profile</Link>)}!</div>
            <ProjectSelector className={styles['project-selector']} />
        </div>
    );
};

export default Header;
