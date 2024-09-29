import { useState } from "react"
import "./styles/ChoiceSelector.css"
import PropTypes from "prop-types"
import { Checkbox } from '@mui/material'

const ChoiceSelector = ({ active, children, id, initialChecked = false, onChange, className }) => {
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
            <Checkbox id={id} checked={isChecked} onChange={handleChange} disabled={!active} />
            <label htmlFor={id} className="new-project-choice-label">{children}</label>
        </div>
    )
}

ChoiceSelector.propTypes = {
    active: PropTypes.bool,
    children: PropTypes.node,
    id: PropTypes.string,
    initialChecked: PropTypes.bool,
    onChange: PropTypes.func,
    className: PropTypes.string
}

export default ChoiceSelector
