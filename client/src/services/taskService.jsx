import { useAuth } from '../context/AuthContext'

const useTaskService = () => {
    const { api, isDemo } = useAuth()

    return {
        fetchProjectTasks: async (projectId) => {
            try {
                const response = await api.get(`/tasks/project/${projectId}`)
                return response.data
            } catch (error) {
                console.error('🚨 Request failed:', {
                    status: error.response?.status,
                    message: error.response?.data?.message,
                    config: error.config,
                })
                throw error
            }
        },

        createTask: async (taskData) => {
            try {
                if (isDemo) {
                    throw new Error('Creating new tasks is not available in demo mode')
                }
                const response = await api.post('/tasks', taskData)
                return response.data
            } catch (error) {
                if (error.response?.status === 403 && error.response.data?.message?.includes('demo')) {
                    throw new Error('Creating new tasks is not available in demo mode')
                }
                console.error('Error creating task:', error)
                throw error
            }
        },

        updateTask: async (taskId, updatedData) => {
            try {
                if (isDemo) {
                    throw new Error('Task modifications are not available in demo mode')
                }
                const response = await api.put(`/tasks/${taskId}`, updatedData)
                return response.data
            } catch (error) {
                if (error.response?.status === 403 && error.response.data?.message?.includes('demo')) {
                    throw new Error('Task modifications are not available in demo mode')
                }
                console.error('Error updating task:', error)
                throw error
            }
        },

        deleteTask: async (taskId) => {
            try {
                if (isDemo) {
                    throw new Error('Task deletion is not available in demo mode')
                }
                const response = await api.delete(`/tasks/${taskId}`)
                return response.data
            } catch (error) {
                if (error.response?.status === 403 && error.response.data?.message?.includes('demo')) {
                    throw new Error('Task deletion is not available in demo mode')
                }
                console.error('Error deleting task:', error)
                throw error
            }
        },

        updateTaskRisk: async (taskId, riskData) => {
            try {
                if (isDemo) {
                    throw new Error('Risk status modifications are not available in demo mode')
                }
                const response = await api.put(`/tasks/${taskId}/risk`, riskData)
                return response.data
            } catch (error) {
                if (error.response?.status === 403 && error.response.data?.message?.includes('demo')) {
                    throw new Error('Risk status modifications are not available in demo mode')
                }
                console.error('Error updating task risk:', error)
                throw error
            }
        },

        getTaskDetails: async (taskId) => {
            try {
                const response = await api.get(`/tasks/${taskId}`)
                return response.data
            } catch (error) {
                console.error('Error fetching task details:', error)
                throw error
            }
        }
    }
}

export default useTaskService
