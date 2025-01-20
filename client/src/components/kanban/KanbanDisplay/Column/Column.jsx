import { useRef, useMemo } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import PropTypes from 'prop-types'
import styles from './Column.module.css'
import Task from '../Task/Task'
import { useTaskContext } from '../../../../context/TaskContext'

const Column = ({
    column,
    index,
    moveColumn,
    moveTask,
    isEditing,
    selectColumn,
    highlightClass,
    movingTaskId
}) => {
    const { tasks } = useTaskContext()
    const dragDropRef = useRef(null)

    const columnTasks = useMemo(() => {
        if (isEditing) return []

        return tasks.filter(task => task.kanbanColumnId === column._id)
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }, [tasks, column._id, isEditing])

    const [{ isDragging }, drag] = useDrag({
        type: 'COLUMN',
        item: () => {
            if (isEditing) {
                selectColumn()
            }
            return {
                type: 'COLUMN',
                index,
                columnId: column._id
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        canDrag: () => isEditing,
    })

    const [{ isOver }, drop] = useDrop({
        accept: ['COLUMN', 'TASK'],
        hover: (draggedItem, monitor) => {
            if (!draggedItem) return

            if (draggedItem.type === 'COLUMN') {
                if (draggedItem.index !== index) {
                    moveColumn(draggedItem.index, index)
                    draggedItem.index = index
                }
                return;
            }

            if (draggedItem.type === 'TASK' && !isEditing) {
                if (draggedItem.columnId === column._id) return

                moveTask(
                    draggedItem.columnId,
                    column._id,
                    draggedItem.index,
                    columnTasks.length,
                    draggedItem.taskId
                );

                draggedItem.columnId = column._id
                draggedItem.index = columnTasks.length
            }
        },
        collect: (monitor) => ({
            isOver: monitor.isOver()
        })
    });

    drag(dragDropRef)
    drop(dragDropRef)

    return (
        <div
            ref={dragDropRef}
            className={`${styles['column-container']}
                        ${highlightClass ? styles['column-highlight'] : ''}
                        ${isOver ? styles['column-is-over'] : ''}`}
            data-editing={isEditing}
            style={{
                opacity: isDragging ? 0.5 : 1,
                backgroundColor: column.color,
            }}
            onClick={() => {
                if (isEditing) {
                    selectColumn()
                }
            }}
        >
            <div className={styles['column-header-container']}>
                <span className={styles['column-title']}>{column.name}</span>
            </div>
            <div className={styles['column-content-container']}>
                {!isEditing && columnTasks.map((task, taskIndex) => (
                    <Task
                        key={task._id}
                        task={task}
                        index={taskIndex}
                        moveTask={moveTask}
                        columnId={column._id}
                        isMoving={movingTaskId === task._id}
                        isEditing={isEditing}
                    />
                ))}
            </div>
        </div>
    )
}

Column.propTypes = {
    column: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        order: PropTypes.number.isRequired,
        maxTasks: PropTypes.number,
    }).isRequired,
    index: PropTypes.number.isRequired,
    moveColumn: PropTypes.func.isRequired,
    moveTask: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    selectColumn: PropTypes.func.isRequired,
    highlightClass: PropTypes.bool.isRequired,
    movingTaskId: PropTypes.string
}

export default Column
