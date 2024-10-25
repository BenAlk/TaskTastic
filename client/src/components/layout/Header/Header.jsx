import styles from "./Header.module.css"
import { Link } from "react-router-dom"
import {useAuth} from "../../../context/AuthContext"
import ProjectSelector from "./ProjectSelector/ProjectSelector"
import ProjectSlider from "./ProjectSelector/ProjectSlider"
const Header = () => {
    const { currentUser } = useAuth()

    return (
        <div className={styles['header-container']}>
            <div className={styles['welcome-container']}>Welcome back, {currentUser.firstName ? currentUser.firstName : (<Link to="/settings" className={styles['complete-profile-link']}>Click here to complete your profile</Link>)}!</div>
            {/* <ProjectSelector className={styles['project-selector']} /> */}
            <ProjectSlider className={styles['project-slider']} />
        </div>
    );
};

export default Header;
