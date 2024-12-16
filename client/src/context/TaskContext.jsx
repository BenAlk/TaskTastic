import { createContext, useState, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import useTaskService from "../services/taskService"
import { useProjectContext } from './ProjectContext'

const TaskContext = createContext();

export const useTaskContext = () => {
    return useContext(TaskContext);
};

export const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);
    const [currentTask, setCurrentTask] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState(null);

    const { currentProject } = useProjectContext()
    const taskService = useTaskService()

    const fetchTasks = useCallback(async (projectId) => {
        setLoading(true);
        try {
            const fetchedTasks = await taskService.fetchProjectTasks(projectId);
            setTasks(fetchedTasks);
            setErrors({});
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
            setErrors(prev => ({...prev, fetch: 'Failed to fetch tasks'}));
            setTasks([]);
        } finally {
            setLoading(false);
        }
    }, [taskService]);

    const createTask = useCallback(async (taskData) => {
        if (currentProject && !currentProject?._id) {
            setErrors(prevErrors => ({
                ...prevErrors,
                create: 'No project selected.'
            }))
            return null
        }

        try {
            const newTask = await taskService.createTask({
                ...taskData
            })
            setTasks(prevTasks => [...prevTasks, newTask])
            return newTask
            } catch (error) {
                console.error('Error creating task:', error)
                setErrors(prevErrors => ({
                    ...prevErrors,
                    create: 'Failed to create task'
                }))
                return null
        }
    }, [taskService, currentProject])

    const updateTask = useCallback(async (taskId, updatedData) => {
        try {
            const updatedTask = await taskService.updateTask(taskId, updatedData)
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === taskId ? updatedTask : task
                )
            )

            if (currentTask?._id === taskId) {
                setCurrentTask(updatedTask)
            }
            return updatedTask
        } catch (error) {
            console.error('Error updating task:', error)
            setErrors(prevErrors => ({
                ...prevErrors,
                update: 'Failed to update task'
            }))
            return null
        }                                           // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskService])

    const deleteTask = useCallback(async (taskId) => {
        try {
            await taskService.deleteTask(taskId)
            setTasks(prevTasks =>
                prevTasks.filter(task => task._id !== taskId)
            )

            if(currentTask?._id === taskId) {
                setCurrentTask(null)
            }
            return true
        } catch (error) {
            console.error('Error deleting task:', error)
            setErrors(prevErrors => ({
                ...prevErrors,
                delete: 'Failed to delete task'
            }))
            return false
        }                                           // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskService])

    const updateTaskRisk = useCallback(async (taskId, riskData) => {
        try {
            const updatedTask = await taskService.updateTaskRisk(taskId, riskData)
            setTasks(prevTasks =>
                prevTasks.map(task =>
                    task._id === taskId ? updatedTask : task
                )
            )
            return updatedTask
        } catch (error) {
            console.error('Error updating task risk:', error)
            setErrors(prevErrors => ({
                ...prevErrors,
                update: 'Failed to update task risk status'
            }))
            return null
        }
    }, [taskService])

    const value = {
        tasks,
        currentTask,
        setCurrentTask,
        loading,
        errors,
        fetchTasks,
        createTask,
        updateTask,
        deleteTask,
        updateTaskRisk
    }

    return (
        <TaskContext.Provider value={value}>
            {children}
        </TaskContext.Provider>
    );
}

TaskProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default TaskProvider
