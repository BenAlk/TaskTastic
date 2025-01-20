import styles from './WarningBanner.module.css'

const WarningBanner = () => {
    return (
        <div className={styles['banner-container']}>
            <div className={styles['banner-content']}>
                <div className={styles['icon-container']}>
                    <svg className={styles['icon']} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className={styles['text-container']}>
                    <p className={styles['warning-text']}>
                        <span className={styles['warning-text-bold']}>Important Notice: </span>
                        This is a portfolio demonstration project. Please use a test email address and password. Do not enter any real personal information as this site is for demonstration purposes only.
                    </p>
                    <p className={`${styles['warning-text']} ${styles['margin-top']}`}>
                        <span className={styles['warning-text-bold']}>Authentication Notice: </span>
                        This application uses JWT (JSON Web Tokens) stored in your browser&apos;s local storage for authentication purposes. These tokens are temporary and will be cleared when you log out or close your browser.
                    </p>

                    <p className={`${styles['warning-text']} ${styles['margin-top']}`}>
                        For a demo version please go to login and click the demo button.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default WarningBanner
