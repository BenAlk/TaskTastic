// KanbanSetup.js
import { useState } from 'react';
import PropTypes from 'prop-types';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import KanbanColumn from './KanbanColumn';
import styles from './KanbanSetup.module.css';

const KanbanSetup = ({ formData, setFormData, errors }) => {
    const [newColumn, setNewColumn] = useState({
        name: '',
        color: '#EE0000',
        maxDays: 0,
        maxTasks: 0
    });

    const handleNewColumnChange = (field, value) => {
        setNewColumn(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleAddColumn = () => {
        if(!newColumn.name.trim()) return;

        const order = formData.kanbanColumns.length;
        setFormData(prev => ({
            ...prev,
            kanbanColumns: [
                ...prev.kanbanColumns,
                {...newColumn, order }
            ]
        }));

        setNewColumn({
            name: '',
            color: '#EE0000',
            maxDays: 0,
            maxTasks: 0
        });
    };

    const handleUpdateColumn = (columnIndex, field, value) => {
        setFormData(prev => ({
            ...prev,
            kanbanColumns: prev.kanbanColumns.map((column, index) =>
                index === columnIndex ? { ...column, [field]: value } : column
            )
        }));
    };

    const handleDeleteColumn = (columnIndex) => {
        setFormData(prev => ({
            ...prev,
            kanbanColumns: prev.kanbanColumns
                .filter((_, index) => index !== columnIndex)
                .map((column, index) => ({ ...column, order:index }))
        }));
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(formData.kanbanColumns);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const updatedItems = items.map((item, index) => ({
            ...item,
            order: index
        }));

        setFormData(prev => ({
            ...prev,
            kanbanColumns: updatedItems
        }));
    };

    const validateColumn = (column) => {
        const errors = {};
        if(!column.name.trim()) errors.name = 'Name is required';
        if(column.maxDays < 0) errors.maxDays = 'Max days must be a positive number';
        if(column.maxTasks < 0) errors.maxTasks = 'Max tasks must be a positive number';
        return errors;
    };

    return (
            <div className={styles['kanban-setup-container']}>
                <div className={styles['header-container']}>
                    <h2>KanbanIcon</h2>
                    <h2 className={styles['title']}>Kanban Setup</h2>
                </div>

                <div className={styles['add-column-form']}>
                    <h3 className={styles['sub-title']}>Add New Column</h3>
                    <div className={styles['add-column-input-container']}>
                        <input
                            type="text"
                            placeholder="Column Name"
                            value={newColumn.name}
                            onChange={(e) => handleNewColumnChange('name', e.target.value)}
                            className={styles['input']}
                            aria-label="Column Name"
                        />
                        <input
                            type="color"
                            value={newColumn.color}
                            onChange={(e) => handleNewColumnChange('color', e.target.value)}
                            className={styles['input']}
                            aria-label="Column Color"
                        />
                        <input
                            type="number"
                            value={newColumn.maxDays}
                            onChange={(e) => handleNewColumnChange('maxDays', parseInt(e.target.value))}
                            placeholder="Max Days"
                            className={styles['input']}
                            aria-label="Max Days"
                        />
                        <input
                            type="number"
                            value={newColumn.maxTasks}
                            onChange={(e) => handleNewColumnChange('maxTasks', parseInt(e.target.value))}
                            placeholder="Max Tasks"
                            className={styles['input']}
                            aria-label="Max Tasks"
                        />
                        <button
                            onClick={handleAddColumn}
                            className={styles['add-button']}
                            aria-label="Add Column"
                        >
                            Add Column
                        </button>
                    </div>
                </div>

                <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable
                    droppableId="kanban-columns"
                    direction="horizontal"
                    type="COLUMN"
                >
                    {(provided, snapshot) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`${styles['columns-container']} ${
                                snapshot.isDraggingOver ? styles['dragging-over'] : ''
                            }`}
                        >
                            {formData.kanbanColumns.map((column, index) => (
                                <KanbanColumn
                                    key={`column-${column.name}-${index}`}
                                    column={column}
                                    index={index}
                                    onUpdate={(field, value) => handleUpdateColumn(index, field, value)}
                                    onDelete={() => handleDeleteColumn(index)}
                                    errors={validateColumn(column)}
                                />
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

KanbanSetup.propTypes = {
    formData: PropTypes.shape({
        kanbanColumns: PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string.isRequired,
            color: PropTypes.string.isRequired,
            maxDays: PropTypes.number.isRequired,
            maxTasks: PropTypes.number.isRequired,
            order: PropTypes.number.isRequired
        })).isRequired
    }).isRequired,
    setFormData: PropTypes.func.isRequired,
    errors: PropTypes.object
};

export default KanbanSetup;
