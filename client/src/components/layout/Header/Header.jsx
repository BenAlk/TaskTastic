import styles from "./Header.module.css"
import { Link } from "react-router-dom"
import {useAuth} from "../../../context/AuthContext"
import ProjectSlider from "./ProjectSlider/ProjectSlider"
const Header = () => {
    const { currentUser } = useAuth()

    return (
        <div className={styles['header-container']}>
            <div className={styles['welcome-container']}>Welcome back, {currentUser.firstName ? currentUser.firstName : (<Link to="/settings" className={styles['complete-profile-link']}>Click here to complete your profile</Link>)}!</div>
            <ProjectSlider className={styles['project-slider']} />
        </div>
    )
}

export default Header
