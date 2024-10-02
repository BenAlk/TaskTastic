import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './styles/Dropdown.css';

const Dropdown = ({ trigger, children, className }) => {
const [isOpen, setIsOpen] = useState(false);
const dropdownRef = useRef(null);

const toggleDropdown = () => setIsOpen(!isOpen);

const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
    setIsOpen(false);
    }
};

useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
    document.removeEventListener('mousedown', handleClickOutside);
    };
}, []);

return (
    <div className={`dropdown ${className}`} ref={dropdownRef}>
    <div className="dropdown-trigger" onClick={toggleDropdown}>
        {trigger}
    </div>
    {isOpen && (
        <div className="dropdown-content">
        {children}
        </div>
    )}
    </div>
);
};

Dropdown.propTypes = {
trigger: PropTypes.node.isRequired,
children: PropTypes.node.isRequired,
className: PropTypes.string,
};

export default Dropdown;
