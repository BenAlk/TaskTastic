import { useState } from "react"
import "./styles/ChoiceSelector.css"
import PropTypes from "prop-types"
import { Checkbox } from '@mui/material'

const ChoiceSelector = ({ order = false, active, children, id, initialChecked = false, onChange, className }) => {
    const [isChecked, setIsChecked] = useState(initialChecked)

    const handleChange = (event) => {
        const newCheckedState = event.target.checked
        setIsChecked(newCheckedState)
        if (onChange) {
            onChange(id, newCheckedState)
        }
    }

    return (
        <div className={`choice-selector selector-${className}`}>
            {order === false ? <Checkbox id={id} checked={isChecked} onChange={handleChange} disabled={!active} /> : null}
            <label htmlFor={id} className="new-project-choice-label">{children}</label>
            {order === true ? <Checkbox id={id} checked={isChecked} onChange={handleChange} disabled={!active} /> : null}
        </div>
    )
}

ChoiceSelector.propTypes = {
    order: PropTypes.bool,
    active: PropTypes.bool,
    children: PropTypes.node,
    id: PropTypes.string,
    initialChecked: PropTypes.bool,
    onChange: PropTypes.func,
    className: PropTypes.string
}

export default ChoiceSelector
