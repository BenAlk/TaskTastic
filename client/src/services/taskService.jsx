import { useAuth } from '../context/AuthContext'

const useTaskService = () => {
    const { api } = useAuth()

    return {
        fetchProjectTasks: async (projectId) => {
            try {
                const response = await api.get(`/tasks/project/${projectId}`)
                return response.data
            } catch (error) {
                console.error('Error fetching project tasks:', error)
                throw error
            }
        },
        createTask: async (taskData) => {
            try {
                const response = await api.post('/tasks', taskData)
                return response.data
            } catch (error) {
                console.error('Error creating task:', error)
                throw error
            }
        },
        updateTask: async (taskId, updatedData) => {
            try {
                const response = await api.put(`/tasks/${taskId}`, updatedData)
                return response.data
            } catch (error) {
                console.error('Error updating task:', error)
                throw error
            }
        },
        deleteTask: async (taskId) => {
            try {
                const response = await api.delete(`/tasks/${taskId}`)
                return response.data
            } catch (error) {
                console.error('Error deleting task:', error)
                throw error
            }
        }
    }
}

export default useTaskService
