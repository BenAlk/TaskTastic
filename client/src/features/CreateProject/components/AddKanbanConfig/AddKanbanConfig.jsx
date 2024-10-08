import { useState, useContext } from 'react'
import PropTypes from "prop-types"
import ChooseColumnHeaderColor from '../ChooseColumnHeaderColor/ChooseColumnHeaderColor'
import "./styles/AddKanbanConfig.css"
import { generateRandomId } from '../../utils/generateRandomId'
import { LayoutContext } from "../../../../pages/Layout/index"

const AddKanbanConfig = ({ handleAddColumn}) => {

    const { errors, setErrors } = useContext(LayoutContext);
    const [newColumn, setNewColumn] = useState({
        id: generateRandomId(),
        name: '',
        headerColor: '',
        maxDays: '',
        maxTasks: ''
    });
;

    const validateField = (name, value) => {
        if (name === 'maxDays' || name === 'maxTasks') {
            const numValue = parseInt(value, 10);
            if (isNaN(numValue) || numValue < 0) {
                return 'Please enter a valid number'
            }
        }
        if (name === 'name' && !value.trim()) {
            return 'Please enter a name for the column'
        }
        if (name === 'headerColor' && !value) {
            return 'Please select a header colour'
        }
        return ''
    }

    const handleColumnInputChange = (e) => {
        const { name, value } = e.target;
        let processedValue = value
        if (name === 'maxDays' || name === 'maxTasks') {
            // Remove any non-digit characters
            const numericValue = value.replace(/\D/g, '');

            // Parse the numeric value
            const numValue = parseInt(numericValue, 10);

            // Use empty string if NaN, otherwise use the non-negative integer
            processedValue = isNaN(numValue) ? '' : Math.max(0, numValue).toString();
        }
        setNewColumn({ ...newColumn, [name]: processedValue });

        const error = validateField(name, processedValue)
        setErrors(prev => ({ ...prev, [name]: error }))
    };

    const handleConfirmColumn = () => {
        const newErrors = {}
        Object.entries(newColumn).forEach(([key, value]) => {
            const error = validateField(key, value)
            if (error) {
                newErrors[key] = error
            }
        })

        if (Object.keys(newErrors).length === 0) {
            handleAddColumn(newColumn);
            setNewColumn({
                id: generateRandomId(),
                name: '',
                headerColor: '',
                maxDays: '',
                maxTasks: ''
            });
            setErrors({})
        } else {
            setErrors(newErrors)
        }
    };

    return (
        <div className="new-project-kanban-add-column-container">
            <input
                type="text"
                name="name"
                className={`add-kanban-input ${errors.name ? 'input-error' : ''}`}
                placeholder="Column Name"
                value={newColumn.name}
                onChange={handleColumnInputChange}
            />

            <ChooseColumnHeaderColor
                value={newColumn.headerColor}
                onChange={handleColumnInputChange}
                error={errors.headerColor}
            />

            <div className="kanban-column-number-inputs">
                <input
                    type="text"
                    name="maxDays"
                    className={`add-kanban-input max-days ${errors.maxDays ? 'input-error' : ''}`}
                    placeholder="Max Days #"
                    value={newColumn.maxDays}
                    onChange={handleColumnInputChange}
                    title="Maximum days a task can be in this column before flags as high risk."
                    onKeyDown={(e) => {
                        const invalidChars = ['-', '+', 'e', 'E', '.'];
                        if (invalidChars.includes(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    min="0"
                    step="1"
                />

                <input
                    type="text"
                    name="maxTasks"
                    className={`add-kanban-input max-tasks ${errors.maxTasks ? 'input-error' : ''}`}
                    placeholder="Max Tasks #"
                    value={newColumn.maxTasks}
                    onChange={handleColumnInputChange}
                    title="Maximum tasks in this column before flags as high risk."
                    onKeyDown={(e) => {
                        const invalidChars = ['-', '+', 'e', 'E', '.'];
                        if (invalidChars.includes(e.key)) {
                            e.preventDefault();
                        }
                    }}
                    min="0"
                    step="1"
                />
            </div>
            <div className="add-kanban-column-button" onClick={handleConfirmColumn}>Confirm</div>
        </div>
    )
}

AddKanbanConfig.propTypes = {
    handleAddColumn: PropTypes.func.isRequired,
}

export default AddKanbanConfig
