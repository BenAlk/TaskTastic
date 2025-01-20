import { useState, useCallback, useEffect, useMemo } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import PropTypes from 'prop-types'
import styles from './KanbanDisplay.module.css'
import Column from './Column/Column'
import { useTaskContext } from '../../../context/TaskContext'

const ColumnSkeleton = () => (
    <div className={styles['column-container']}>
        <div className={styles['column-header-container']}>
            <div className={styles['skeleton-title']}></div>
            <div className={styles['skeleton-count']}></div>
        </div>
        <div className={styles['column-content-container']}>
            {[1, 2, 3].map((i) => (
                <div key={i} className={styles['skeleton-task']}>
                    <div className={styles['skeleton-task-title']}></div>
                    <div className={styles['skeleton-task-footer']}>
                        <div className={styles['skeleton-avatar']}></div>
                        <div className={styles['skeleton-name']}></div>
                    </div>
                </div>
            ))}
        </div>
    </div>
)

const KanbanDisplay = ({
    currentProject,
    setSelectedColumn,
    selectedColumn,
    isEditing,
    setDraftKanban
}) => {
    const { tasks, fetchTasks, updateTask } = useTaskContext()
    const [columns, setColumns] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [movingTaskId, setMovingTaskId] = useState(null)

    const tasksMap = useMemo(() => {
        return tasks.reduce((acc, task) => {
            acc[task._id] = task
            return acc
        }, {})
    }, [tasks])

    useEffect(() => {
        let isSubscribed = true

        const loadData = async () => {
            if (!currentProject?._id) return

            setIsLoading(true)
            try {
                await fetchTasks(currentProject._id)
            } catch (error) {
                console.error('Failed to fetch tasks:', error)
            } finally {
                if (isSubscribed) {
                    setTimeout(() => setIsLoading(false), 300)
                }
            }
        }

        loadData()

        return () => {
            isSubscribed = false
        }
    }, [currentProject?._id])

    useEffect(() => {
        if (currentProject?.kanbanColumns) {
            const columnsToSort = [...currentProject.kanbanColumns]
            const sortedColumns = columnsToSort.sort((a, b) => a.order - b.order)
            setColumns(sortedColumns)
        }
    }, [currentProject?.kanbanColumns])

    const moveColumn = useCallback((fromIndex, toIndex) => {
        if (!isEditing) return

        setColumns(prevColumns => {
            const newColumns = [...prevColumns]
            const [movedColumn] = newColumns.splice(fromIndex, 1)
            newColumns.splice(toIndex, 0, movedColumn)

            const updatedColumns = newColumns.map((column, index) => ({
                ...column,
                order: index
            }))

            setDraftKanban(updatedColumns)
            return updatedColumns
        })
    }, [isEditing, setDraftKanban])

    const moveTask = useCallback(async (fromColumnId, toColumnId, fromIndex, toIndex, taskId) => {
        if (isEditing) return

        const taskToMove = tasksMap[taskId];
        if (!taskToMove) {
            return
        }

        try {
            setMovingTaskId(taskId)

            const sortedColumns = [...columns].sort((a, b) => a.order - b.order)
            const lastColumnId = sortedColumns[sortedColumns.length - 1]._id
            const isMovingFromLastColumn = fromColumnId === lastColumnId
            const isMovingToLastColumn = toColumnId === lastColumnId
            let completedData = {}

            if (isMovingToLastColumn) {
                completedData = {
                    completed: {
                        isCompleted: true,
                        completedOn: new Date().toISOString(),
                        completedBy: 'currentUserId'
                    }
                }
            } else if (isMovingFromLastColumn) {
                completedData = {
                    completed: {
                        isCompleted: false,
                        completedOn: null,
                        completedBy: null
                    }
                }
            }

            const updateData = {
                kanbanColumnId: toColumnId,
                ...completedData
            }

            await updateTask(taskId, updateData)
        } catch (error) {
            console.error('Failed to move task:', error)
        } finally {
            setMovingTaskId(null)
        }
    }, [tasksMap, updateTask, isEditing, columns])

    if (isLoading) {
        const skeletonCount = currentProject?.kanbanColumns?.length || 0
        return (
            <div className={styles['kanban-display-container']}>
                <div className={styles['kanban-columns-container']}>
                    {skeletonCount > 0 ? (
                        [...Array(skeletonCount)].map((_, i) => (
                            <ColumnSkeleton key={i} />
                        ))
                    ) : (
                        <div className={styles['no-columns-placeholder']}>
                            {isEditing ? "Add your first column" : "This project has no Kanban columns"}
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className={styles['kanban-display-container']}>
                <div className={styles['kanban-columns-container']}>
                    {columns.map((column, index) => (
                        <Column
                            key={column._id}
                            column={column}
                            index={index}
                            moveColumn={moveColumn}
                            moveTask={moveTask}
                            isEditing={isEditing}
                            selectColumn={() => setSelectedColumn(column._id)}
                            highlightClass={selectedColumn === column._id}
                            movingTaskId={movingTaskId}
                        />
                    ))}
                </div>
            </div>
        </DndProvider>
    )
}

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
    setSelectedColumn: PropTypes.func.isRequired,
    selectedColumn: PropTypes.string,
    isEditing: PropTypes.bool.isRequired,
    setDraftKanban: PropTypes.func.isRequired
}

export default KanbanDisplay
