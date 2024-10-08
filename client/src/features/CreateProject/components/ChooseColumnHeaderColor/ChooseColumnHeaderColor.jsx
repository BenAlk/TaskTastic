import { useState } from 'react';
import PropTypes from 'prop-types';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import './styles/ChooseColumnHeaderColor.css';

const columnHeaderColors = [
  "#3498db", "#2ecc71", "#e74c3c", "#f39c12", "#9b59b6", "#1abc9c",
  "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#f1c40f",
  "#e67e22", "#95a5a6", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d",
  "#ffffff", "#000000"
];

const ChooseColumnHeaderColor = ({ value , onChange, error}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleColorSelect = (color) => {
        onChange({ target: { name: 'headerColor', value: color } });
        setIsOpen(false);
    };

    const triggerContent = (
        <div className={`column-color-input-container ${error ? 'input-error' : ''}`}>
        <input
            type="text"
            name="headerColor"
            placeholder="Title Colour"
            value={value}
            onChange={onChange}
            readOnly
        />
        <div
            className="column-color-preview"
            style={{ backgroundColor: value }}
        />
        </div>
    );

    return (
        <Dropdown
        trigger={triggerContent}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        className="column-color-dropdown"
        >
        <div className="column-color-options">
            {columnHeaderColors.map((color) => (
            <div
                key={color}
                className="column-color-option"
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
            />
            ))}
        </div>
        </Dropdown>
    );
};

ChooseColumnHeaderColor.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    error: PropTypes.string
};

export default ChooseColumnHeaderColor;
