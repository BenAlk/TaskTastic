import { Outlet } from 'react-router-dom';
import Header from './Header/Header';
import Navbar from './NavBar/NavBar';
import styles from "./Layout.module.css"

const Layout = () => {
    return (
        <div className={styles.layout}>
            <Navbar />
            <div className={styles['main-content']}>
            <Header />
            <main className={styles.content}>
                <Outlet />
            </main>
            </div>
        </div>
    );
};

export default Layout;
