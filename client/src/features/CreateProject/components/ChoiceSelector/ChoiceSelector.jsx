import { Checkbox } from '@mui/material'
import PropTypes from "prop-types"
import "./styles/ChoiceSelector.css"

const ChoiceSelector = ({ order = false, active = true, children, id, checked, onChange, className, disabled = false }) => {
    const handleChange = (event) => {
        if (onChange) {
            onChange(event.target.checked);
        }
    }

    return (
        <div className={`choice-selector selector-${className}`}>
            {order === false ? (
                <Checkbox
                    id={id}
                    checked={checked}
                    onChange={handleChange}
                    disabled={disabled || !active}
                    inputProps={{ 'aria-label': children }}
                />
            ) : null}
            <label htmlFor={id} className="new-project-choice-label">{children}</label>
            {order === true ? (
                <Checkbox
                    id={id}
                    checked={checked}
                    onChange={handleChange}
                    disabled={disabled || !active}
                    inputProps={{ 'aria-label': children }}
                />
            ) : null}
        </div>
    )
}

ChoiceSelector.propTypes = {
    order: PropTypes.bool,
    active: PropTypes.bool,
    children: PropTypes.node,
    id: PropTypes.string.isRequired,
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool
}

export default ChoiceSelector
