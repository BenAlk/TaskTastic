import PropTypes from 'prop-types';
import styles from './Modal.module.css';

const Modal = ({
    isOpen,
    onClose,
    title,
    children,
    showHeader = true,
    className = '',
    width = '500px',
    closeOnOverlayClick = true,
}) => {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => {
        if (closeOnOverlayClick && e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles['modal-overlay']} onClick={handleOverlayClick}>
            <div
                className={`${styles['modal-container']} ${className}`}
                onClick={e => e.stopPropagation()}
                style={{ width }}
            >
                {showHeader && title && (
                    <div className={styles['modal-title']}>
                        {title}
                    </div>
                )}
                {children}
            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string,
    children: PropTypes.node,
    showHeader: PropTypes.bool,
    className: PropTypes.string,
    width: PropTypes.string,
    closeOnOverlayClick: PropTypes.bool,
};

export default Modal;
