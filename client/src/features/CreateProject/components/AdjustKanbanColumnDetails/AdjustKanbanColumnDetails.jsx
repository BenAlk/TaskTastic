import { useEffect, useState, useRef } from "react"
import PropTypes from "prop-types"
import "./styles/AdjustKanbanColumnDetails.css"
import ChooseColumnHeaderColor from '../ChooseColumnHeaderColor/ChooseColumnHeaderColor'

const AdjustKanbanColumnDetails = ({
    selectedId,
    kanbanColumns,
    handleUpdateColumn,
    activeColumn,
    setActiveColumn,
    handleMoveColumn,
}) => {
    const [originalValues, setOriginalValues] = useState({});
    const initialRenderRef = useRef(true);

    useEffect(() => {
        const column = kanbanColumns.find(column => column.id === selectedId)
        if (column) {
            setActiveColumn({...column})
            if (initialRenderRef.current) {
                setOriginalValues({
                    name: column.columnName || '',
                    maxDays: column.maxDays || '',
                    maxTasks: column.maxTasks || ''
                })
                initialRenderRef.current = false;
            }
        } else {
            setActiveColumn(null)
            setOriginalValues({})
            initialRenderRef.current = true;
        }
    }, [selectedId, kanbanColumns, setActiveColumn])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        let processedValue = value

        if (name === 'maxDays' || name === 'maxTasks') {
            const numericValue = value.replace(/\D/g, '');
            processedValue = numericValue === '' ? '' : Math.max(0, parseInt(numericValue, 10)).toString();
        }

        const updatedColumn = {
            ...activeColumn,
            [name]: processedValue
        }
        setActiveColumn(updatedColumn)
        handleUpdateColumn(updatedColumn)
    }

    const handleInputBlur = (e) => {
        const { name, value } = e.target
        if ((name === 'columnName' || name === 'maxDays' || name === 'maxTasks') && value.trim() === '' && originalValues[name] !== '') {
            const updatedColumn = {
                ...activeColumn,
                [name]: originalValues[name]
            }
            setActiveColumn(updatedColumn)
            handleUpdateColumn(updatedColumn)
        }
    }
    const index = kanbanColumns.findIndex(column => column.id === selectedId)

    if(!activeColumn) {
        return <div className="kanban-info-placeholder">No Column Selected.</div>
    }

    return (
        <div className="new-project-kanban-adjust-column-container">
            <div className="input-container">
                <div className="new-project-kanban-adjust-column-container-inputs">Column Name</div>
                <input
                    type="text"
                    name="name"
                    className="add-kanban-input"
                    placeholder="Column Name"
                    value={activeColumn.columnName}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                />
            </div>
            <div className="input-container">
                <div className="new-project-kanban-adjust-column-container-inputs">Title Bar Colour</div>
                <ChooseColumnHeaderColor
                    value={activeColumn.headerColor}
                    onChange={handleInputChange}
                />
            </div>
            <div className="kanban-column-number-inputs">
                <div className="input-container-numbers">
                    <div className="new-project-kanban-adjust-column-container-inputs">Max Days</div>
                    <input
                        type="text"
                        name="maxDays"
                        className="add-kanban-input max-days"
                        placeholder="Max Days"
                        value={activeColumn.maxDays}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                    />
                </div>
                <div className="input-container-numbers">
                    <div className="new-project-kanban-adjust-column-container-inputs">Max Tasks</div>
                    <input
                        type="text"
                        name="maxTasks"
                        className="add-kanban-input max-tasks"
                        placeholder="Max Tasks"
                        value={activeColumn.maxTasks}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                    />
                </div>
            </div>
            <div className="column-order-controls">
                <div className={`adjust-column-order-button ${index === 0 ? "disabled-button" : ""}`} onClick={() => handleMoveColumn('up')}>
                    Move Left
                </div>
                <div className={`adjust-column-order-button ${index === kanbanColumns.length - 1 ? "disabled-button" : ""}`} onClick={() => handleMoveColumn('down')}>
                    Move Right
                </div>
            </div>
        </div>
    )
}

AdjustKanbanColumnDetails.propTypes = {
    selectedId: PropTypes.string,
    kanbanColumns: PropTypes.array.isRequired,
    handleUpdateColumn: PropTypes.func.isRequired,
    activeColumn: PropTypes.object,
    setActiveColumn: PropTypes.func.isRequired,
    handleMoveColumn: PropTypes.func.isRequired,
}

export default AdjustKanbanColumnDetails
