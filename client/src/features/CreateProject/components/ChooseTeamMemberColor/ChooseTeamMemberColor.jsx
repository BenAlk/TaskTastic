import { useState } from 'react';
import Dropdown from '../../../../components/Dropdown/Dropdown';
import './styles/ChooseTeamMemberColor.css';
import PropTypes from 'prop-types'

const uniqueHexCodes = [
"#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080",
"#008000", "#FFC0CB", "#A52A2A", "#808080", "#000000", "#FFFFFF", "#1E90FF", "#FFD700",
"#32CD32", "#FF4500", "#8A2BE2", "#2F4F4F"
];

const ChooseTeamMemberColor = ({ value = "#000000", onChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleColorSelect = (color) => {
        onChange({ target: { name: 'color', value: color.substring(1) } });
        setIsOpen(false);
    };

    const triggerContent = (
        <div className="color-input-container">
        <input
            type="text"
            name="color"
            placeholder="Hex Color - No #"
            value={value}
            onChange={onChange}
            readOnly
        />
        <div
            className="color-preview"
            style={{ backgroundColor: `#${value}` }}
        />
        </div>
    );

    return (
        <Dropdown
        trigger={triggerContent}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        className="color-dropdown"
        >
        <div className="color-options">
            {uniqueHexCodes.map((color) => (
            <div
                key={color}
                className="color-option"
                style={{ backgroundColor: color }}
                onClick={() => handleColorSelect(color)}
            />
            ))}
        </div>
        </Dropdown>
    );
};

ChooseTeamMemberColor.propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default ChooseTeamMemberColor;
