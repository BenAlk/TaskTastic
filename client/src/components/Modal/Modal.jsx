import PropTypes from 'prop-types';
import './styles/Modal.css';

const Modal = ({ isOpen, onClose, children, className }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
        <div className={`modal-content ${className}`}>
            <button className="modal-close" onClick={onClose}>
            &times;
            </button>
            {children}
        </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
};

export default Modal;
