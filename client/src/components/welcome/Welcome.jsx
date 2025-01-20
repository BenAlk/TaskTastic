import styles from "./Welcome.module.css"
import { Link } from 'react-router-dom'
import WarningBanner from '../warning/WarningBanner'
import logo from "../../assets/logo.jpg"

const Welcome = () => {
    return (
        <div className={styles['welcome-container']}>
            <WarningBanner />
            <div className={styles['logo-container']}>
                <div className={styles['tasktastic-logo']}>
                    <img src={logo} alt="TaskTastic Logo" />
                </div>
                <h1 className={styles['tasktastic-title']}>TaskTastic</h1>
            </div>
            <div className={styles['auth-container']}>
                <Link to="/signup" className='btn'>Sign Up</Link>
                <Link to="/login" className='btn'>Log In</Link>
            </div>
        </div>
    )
}

export default Welcome
