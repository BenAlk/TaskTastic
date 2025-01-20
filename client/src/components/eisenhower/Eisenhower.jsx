import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTaskContext } from '../../context/TaskContext'
import { useProjectContext } from '../../context/ProjectContext'
import styles from './Eisenhower.module.css'

const Eisenhower = () => {
    const { tasks, loading, fetchTasks } = useTaskContext()
    const { currentProject } = useProjectContext()
    const navigate = useNavigate()

    const handleTaskClick = (taskId) => {
        navigate(`/tasks?taskId=${taskId}`)
    }

    useEffect(() => {
        if (currentProject?._id) {
            fetchTasks(currentProject._id)
        }
    }, [currentProject?._id])

    const quadrants = {
        urgentImportant: tasks.filter(task =>
            task.eisenhowerStatus?.urgent && task.eisenhowerStatus?.important && task.completed?.isCompleted === false
        ),
        notUrgentImportant: tasks.filter(task =>
            !task.eisenhowerStatus?.urgent && task.eisenhowerStatus?.important && task.completed?.isCompleted === false
        ),
        urgentNotImportant: tasks.filter(task =>
            task.eisenhowerStatus?.urgent && !task.eisenhowerStatus?.important && task.completed?.isCompleted === false
        ),
        notUrgentNotImportant: tasks.filter(task =>
            !task.eisenhowerStatus?.urgent && !task.eisenhowerStatus?.important && task.completed?.isCompleted === false
        )
    }

    if (!currentProject) {
        return (
            <div className={styles.eisenhowerContainer}>
                <div className={styles.eisenhowerHeaderContainer}>
                    <h2>Eisenhower Matrix</h2>
                </div>
                <div className={styles.selectProject}>
                    Please select a project to view tasks.
                </div>
            </div>
        );
    }

    return (
        <div className={styles.eisenhowerContainer}>
            <div className={styles.eisenhowerHeaderContainer}>
                <h2>Eisenhower Matrix</h2>
            </div>
            {loading ? (
                <div>Loading tasks...</div>
            ) : (
                <div className={styles.matrixWrapper}>
                    <div className={styles.topHeaders}>
                        <div className={styles.topHeader}>Urgent</div>
                        <div className={styles.topHeader}>Not Urgent</div>
                    </div>

                    <div className={styles.matrixContent}>
                        <div className={styles.sideHeaders}>
                            <div className={styles.sideHeader}>Important</div>
                            <div className={styles.sideHeader}>Not Important</div>
                        </div>

                        <div className={styles.matrix}>
                            <div className={styles.quadrant + ' ' + styles.urgentImportant}>
                                <h3>Do First</h3>
                                <ul>
                                    {quadrants.urgentImportant.map(task => (
                                        <li
                                            key={task._id}
                                            onClick={() => handleTaskClick(task._id)}
                                        >
                                            {task.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.quadrant + ' ' + styles.notUrgentImportant}>
                                <h3>Schedule</h3>
                                <ul>
                                    {quadrants.notUrgentImportant.map(task => (
                                        <li
                                            key={task._id}
                                            onClick={() => handleTaskClick(task._id)}
                                        >
                                            {task.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.quadrant + ' ' + styles.urgentNotImportant}>
                                <h3>Delegate</h3>
                                <ul>
                                    {quadrants.urgentNotImportant.map(task => (
                                        <li
                                            key={task._id}
                                            onClick={() => handleTaskClick(task._id)}
                                        >
                                            {task.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={styles.quadrant + ' ' + styles.notUrgentNotImportant}>
                                <h3>Eliminate</h3>
                                <ul>
                                    {quadrants.notUrgentNotImportant.map(task => (
                                        <li
                                            key={task._id}
                                            onClick={() => handleTaskClick(task._id)}
                                        >
                                            {task.title}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Eisenhower
