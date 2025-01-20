import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import dayjs from 'dayjs'
import styles from './Tasks.module.css'
import TaskTile from './TaskTile/TaskTile'
import NewTaskTile from './NewTaskTile/NewTaskTile'
import { useTaskContext } from '../../context/TaskContext'
import { useProjectContext } from '../../context/ProjectContext'
import { useProjectPermissions } from '../../hooks/useProjectPermissions'

const Tasks = () => {
    const { tasks, loading, errors, fetchTasks } = useTaskContext()
    const { currentProject } = useProjectContext()
    const { getUserProjectRole } = useProjectPermissions()
    const [searchParams] = useSearchParams()
    const selectedTaskId = searchParams.get('taskId')


    useEffect(() => {
        let mounted = true;
        const loadTasks = async () => {
            if (currentProject?._id && mounted) {
                await fetchTasks(currentProject._id)
            }
        }
        loadTasks()
        return () => {
            mounted = false
        }
    }, [currentProject?._id])

    const sortedTasks = useMemo(() => {
        return [...tasks].sort((a, b) => {
            if (!a.dueDate && !b.dueDate) return 0
            if (!a.dueDate) return 1
            if (!b.dueDate) return -1
            return dayjs(a.dueDate).diff(dayjs(b.dueDate))
        })
    }, [tasks])

    const userRole = getUserProjectRole()
    const canAddTasks = userRole === 'owner' || userRole === 'admin'

    const renderEmptyState = () => {
        if (canAddTasks) {
            return <NewTaskTile />
        }
        return (
            <div className={styles['empty-state-message']}>
                <p>There are no tasks in this project yet.</p>
                <p>Please wait for a project administrator to add tasks.</p>
            </div>
        )
    }

    if (!currentProject) {
        return (
            <div className={styles['task-container']}>
                <div className={styles['task-header-container']}>
                    <h2>Tasks</h2>
                </div>
                <div className={styles['task-content-container']}>
                    <div className={styles['select-a-task']}>Please select a project to view tasks.</div>
                </div>
            </div>
        )
    }

    return (
        <div className={styles['task-container']}>
            <div className={styles['task-header-container']}>
                <h2>Tasks</h2>
            </div>
            <div className={styles['task-content-container']}>
                {loading ? (
                    <div>Loading tasks...</div>
                ) : errors?.fetch ? (
                    <div>Error: {errors.fetch}</div>
                ) : tasks.length === 0 ? (
                    renderEmptyState()
                ) : (
                    <>
                        {sortedTasks
                .filter(task => !task.completed?.isCompleted)
                .map(task => (
                    <TaskTile
                        key={task._id}
                        task={task}
                        initialModalState={task._id === selectedTaskId}
                    />
                ))
            }
            {canAddTasks && <NewTaskTile />}
                    </>
                )}
            </div>
        </div>
    )
}

export default Tasks
