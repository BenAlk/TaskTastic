import { useEffect } from 'react';
import styles from './Tasks.module.css';
import TaskTile from './TaskTile/TaskTile';
import NewTaskTile from './NewTaskTile/NewTaskTile';
import { useTaskContext } from '../../context/TaskContext';
import { useProjectContext } from '../../context/ProjectContext';

const Tasks = () => {
    const { tasks, loading, errors, fetchTasks } = useTaskContext();
    const { currentProject } = useProjectContext();

    useEffect(() => {
        let mounted = true;  // Add mounted check

        const loadTasks = async () => {
            if (currentProject?._id && mounted) {
                await fetchTasks(currentProject._id)
            }
        };

        loadTasks()

        return () => {
            mounted = false
        }                                                    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentProject?._id])

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
        );
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
                ) : tasks.length === 0 ?
                <NewTaskTile />
                : (
                    <>
                        {tasks.map(task => (
                            <TaskTile
                                key={task._id}
                                task={task}
                            />
                        ))}
                        <NewTaskTile />
                    </>
                )}
            </div>
        </div>
    );
};

export default Tasks
