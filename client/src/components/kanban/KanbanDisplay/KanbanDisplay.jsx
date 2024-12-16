import { useState, useCallback, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import PropTypes from 'prop-types';
import styles from './KanbanDisplay.module.css';
import Column from './Column/Column';
import { useTaskContext } from '../../../context/TaskContext';

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
);

const KanbanDisplay = ({
    currentProject,
    setSelectedColumn,
    selectedColumn,
    isEditing,
    setDraftKanban
}) => {
    const { tasks, fetchTasks, updateTask } = useTaskContext();
    const [columns, setColumns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [movingTaskId, setMovingTaskId] = useState(null);

    // Initial load effect
    useEffect(() => {
        const loadData = async () => {
            if (currentProject?._id) {
                setIsLoading(true);
                try {
                    await fetchTasks(currentProject._id);
                } catch (error) {
                    console.error('Failed to fetch tasks:', error);
                } finally {
                    setTimeout(() => setIsLoading(false), 300);
                }
            }
        };
        loadData()                                         // eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentProject])

    useEffect(() => {
        if (currentProject?.kanbanColumns) {
            const columnsToSort = [...currentProject.kanbanColumns];
            const sortedColumns = columnsToSort.sort((a, b) => a.order - b.order);
            setColumns(sortedColumns);
        }
    }, [currentProject?.kanbanColumns]);

    const moveColumn = useCallback((fromIndex, toIndex) => {
        if (!isEditing) return;

        const newColumns = [...columns];
        const [movedColumn] = newColumns.splice(fromIndex, 1);
        newColumns.splice(toIndex, 0, movedColumn);

        const updatedColumns = newColumns.map((column, index) => ({
            ...column,
            order: index
        }));

        setColumns(updatedColumns);
        setDraftKanban(updatedColumns);
    }, [columns, isEditing, setDraftKanban]);

    const moveTask = useCallback(async (fromColumnId, toColumnId, fromIndex, toIndex, taskId) => {
        // Find the specific task using both column ID and task ID
        const taskToMove = tasks.find(task =>
            task.kanbanColumnId === fromColumnId && task._id === taskId
        );

        if (!taskToMove) {
            console.log('Task not found:', { taskId, fromColumnId });
            return;
        }

        try {
            setMovingTaskId(taskToMove._id);

            // Update in database
            await updateTask(taskToMove._id, {
                kanbanColumnId: toColumnId
            });

        } catch (error) {
            console.error('Failed to move task:', error);
        } finally {
            setMovingTaskId(null);
        }
    }, [tasks, updateTask]);

    if (isLoading) {
        const skeletonCount = currentProject?.kanbanColumns?.length || 0;
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
        );
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
    setSelectedColumn: PropTypes.func.isRequired,
    selectedColumn: PropTypes.string,
    isEditing: PropTypes.bool.isRequired,
    setDraftKanban: PropTypes.func.isRequired
};

export default KanbanDisplay;
