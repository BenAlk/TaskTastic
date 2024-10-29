import { useState } from 'react'
import PropTypes from 'prop-types'
import { Draggable } from '@hello-pangea/dnd'
import styles from './KanbanColumn.module.css'

const KanbanColumn = ({ column, index, onUpdate, onDelete, errors }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editValues, setEditValues] = useState(column)

    const handleEdit = () => {
        if(isEditing) {
            onUpdate('name', editValues.name)
            onUpdate('color', editValues.color)
            onUpdate('maxDays', editValues.maxDays)
            onUpdate('maxTasks', editValues.maxTasks)
        }
        setIsEditing(!isEditing)
    }

    const handleCancelEdit = () => {
        setEditValues(column)
        setIsEditing(false)
    }

    const handleChange = (field, value) => {
        setEditValues(prev => ({
            ...prev,
            [field]: value
        }))
    }

    return (
        <Draggable draggableId={`column-${index}`} index={index}>
            {(provided, snapshot) => (
                <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                className={`${styles['container']} ${snapshot.isDragging ? styles['dragging'] : styles['']}`}
                style={{ backgroundColor: column.color }}
                >
                    <div className={styles['column-header']} {...provided.dragHandleProps}>
                        { isEditing ? (
                            <input
                                type="text"
                                value={editValues.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={styles['edit-input']}
                            />
                        ) : (
                            <h3 className={styles['column-name']}>{column.name}</h3>
                        )}
                    </div>

                    <div className={styles['content']}>
                        {isEditing ? (
                            <>
                                <div className={styles['edit-field']}>
                                    <label>Color</label>
                                    <input
                                        type='color'
                                        value={editValues.color}
                                        onChange={(e) => handleChange('color', e.target.value)}
                                        className={styles['color-input']}
                                    />
                                </div>
                                <div className={styles['edit-field']}>
                                    <label>Max Days:</label>
                                    <input
                                        type="number"
                                        value={editValues.maxDays}
                                        onChange={(e) => handleChange('maxDays', parseInt(e.target.value))}
                                        className={styles['number-input']}
                                        min="0"
                                    />
                                </div>
                                <div className={styles['edit-field']}>
                                    <label>Max Tasks:</label>
                                    <input
                                        type="number"
                                        value={editValues.maxTasks}
                                        onChange={(e) => handleChange('maxTasks', parseInt(e.target.value))}
                                        className={styles['number-input']}
                                        min="0"
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={styles['info']}>
                                    <span>Max Days: {column.maxDays}</span>
                                    <span>Max Tasks: {column.maxTasks}</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className={styles['actions']}>
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleEdit}
                                    className={styles['action-button']}
                                >
                                    CheckIcon
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className={styles['action-button']}
                                >
                                    CloseIcon
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleEdit}
                                    className={styles['action-button']}
                                >
                                    EditIcon
                                </button>
                                <button
                                    onClick={onDelete}
                                    className={styles['action-button']}
                                >
                                    DeleteIcon
                                </button>
                            </>
                        )}
                    </div>

                    {errors && Object.values(errors).map((error, i) => (
                        <div key={i} className={styles['error-text']}>{error}</div>
                    ))}
                </div>
            )}
        </Draggable>
    )
}

KanbanColumn.propTypes = {
    column: PropTypes.shape({
        name: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        maxDays: PropTypes.number.isRequired,
        maxTasks: PropTypes.number.isRequired,
        order: PropTypes.number.isRequired
    }).isRequired,
    index: PropTypes.number.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    errors: PropTypes.object
}

export default KanbanColumn
