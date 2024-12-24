import PropTypes from 'prop-types';
import styles from './TabHeader.module.css';

const TabHeader = ({ label, isSelected, onClick }) => (
    <h3
        className={`${styles['message-type-header']} ${isSelected ? styles['selected'] : ''}`}
        onClick={onClick}
        role="tab"
        aria-selected={isSelected}
        tabIndex={0}
    >
        {label}
    </h3>
);

export default TabHeader;

TabHeader.propTypes = {
    label: PropTypes.string.isRequired,
    isSelected: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
}
