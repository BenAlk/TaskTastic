import PropTypes from 'prop-types';
import styles from './KanbanDisplay.module.css';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import { useDrag, useDrop } from 'react-dnd';
import { useState, useEffect, useRef, useCallback } from 'react';

const Column = ({ column, index, moveColumn, isEditing, selectColumn, highlightClass }) => {
    const dragDropRef = useRef(null);

    const [{ isDragging }, drag] = useDrag({
        type: 'COLUMN',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: () => isEditing,
    });

    const [, drop] = useDrop({
        accept: 'COLUMN',
        hover: (draggedItem) => {
            if (draggedItem.index !== index) {
                moveColumn(draggedItem.index, index);
                draggedItem.index = index;
            }
        },
        canDrop: () => isEditing,
    });

    useEffect(() => {
        if (isEditing) {
            drag(dragDropRef);
            drop(dragDropRef);
        }
    }, [drag, drop, isEditing]);

    return (
        <div
            ref={dragDropRef}
            className={`${styles['column']} ${highlightClass ? styles['highlight'] : ''}`}
            style={{
                opacity: isDragging ? 0.5 : 1,
                cursor: isEditing ? 'move' : 'pointer',
                backgroundColor: column.color,
            }}
            onClick={isEditing ? selectColumn : null}
        >
            <div className={styles['column-header']}>
                <span className={styles['column-title']}>{column.name}</span>
            </div>
            <div className={styles['column-content']}>
                {/* Tasks will be added here */}
            </div>
        </div>
    );
};

Column.propTypes = {
    column: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    order: PropTypes.number.isRequired,
    }).isRequired,
    index: PropTypes.number.isRequired,
    moveColumn: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    selectColumn: PropTypes.func.isRequired,
    highlightClass: PropTypes.bool.isRequired
};

const KanbanDisplay = ({ currentProject, setSelectedColumn, selectedColumn, isEditing, setDraftKanban }) => {
    const [columns, setColumns] = useState([]);

    useEffect(() => {
    if (currentProject?.kanbanColumns) {
        const columnsToSort = [...currentProject.kanbanColumns]
        const sortedColumns = columnsToSort.sort((a, b) => a.order - b.order);
        setColumns(sortedColumns);
    }
    }, [currentProject?.kanbanColumns, isEditing]);

    const moveColumn = useCallback((fromIndex, toIndex) => {
        if(!isEditing) return

            const newColumns = [...columns];
            const [movedColumn] = newColumns.splice(fromIndex, 1);
            newColumns.splice(toIndex, 0, movedColumn);

            const updatedColumns = newColumns.map((column, index) => ({
                ...column,
                order: index
            }))
            setColumns(updatedColumns)
            setDraftKanban(updatedColumns)
        }, [columns, isEditing, setDraftKanban])

    return (
    <DndProvider backend={HTML5Backend}>
        <div className={styles['kanban-container']}>
            {columns.map((column, index) => (
            <Column
                key={column._id}
                column={column}
                index={index}
                moveColumn={moveColumn}
                isEditing={isEditing}
                selectColumn={() => {
                    console.log('Column clicked', column._id)
                    setSelectedColumn(column._id)
                }}
                highlightClass={selectedColumn === column._id ? true : false}
            />
            ))}
        </div>
    </DndProvider>
    );
};

KanbanDisplay.propTypes = {
    currentProject: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    projectName: PropTypes.string.isRequired,
    kanbanColumns: PropTypes.arrayOf(
        PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        maxDays: PropTypes.number.isRequired,
        maxTasks: PropTypes.number.isRequired,
        order: PropTypes.number.isRequired,
        })
    ).isRequired,
    }).isRequired,
    setIsEditing: PropTypes.func,
    setSelectedColumn: PropTypes.func.isRequired,
    selectedColumn: PropTypes.string,
    isEditing: PropTypes.bool.isRequired,
    setDraftKanban: PropTypes.func.isRequired
};


export default KanbanDisplay;
