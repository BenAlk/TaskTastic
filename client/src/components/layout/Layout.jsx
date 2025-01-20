import { Outlet } from 'react-router-dom'
import Header from './Header/Header'
import Navbar from './NavBar/NavBar'
import styles from "./Layout.module.css"

const Layout = () => {
    return (
        <div className={styles['layout']}>
            <Navbar className={styles['navbar']}/>
            <Header className={styles['header']}/>
            <main className={styles['main']}>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout
