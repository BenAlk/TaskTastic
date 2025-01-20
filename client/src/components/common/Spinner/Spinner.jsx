import PropTypes from 'prop-types'
import styles from './Spinner.module.css'

const Spinner = ({ size = 'medium', variant = 'secondary' }) => {
    const containerClasses = [
        styles["spinner-container"],
        styles[`spinner-${variant}`],
        size !== 'medium' && styles[`spinner-${size}`]
    ].filter(Boolean).join(' ')

    return (
        <div className={containerClasses}>
        <div className={styles["spinner-dot"]}></div>
        <div className={styles["spinner-dot"]}></div>
        <div className={styles["spinner-dot"]}></div>
        </div>
    )
}

Spinner.propTypes = {
size: PropTypes.oneOf(['small', 'medium', 'large']),
variant: PropTypes.oneOf(['primary', 'secondary', 'light'])
}

export default Spinner
