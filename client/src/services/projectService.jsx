import { useAuth } from '../context/AuthContext'

const useProjectService = () => {
const { api, isDemo } = useAuth()

    return {
        fetchProjectList: async () => {
            try {
                const response = await api.get('/projects')
                return response.data
            } catch (error) {
                console.error('Error fetching projects:', error)
                throw error
            }
        },

        fetchProject: async (projectId) => {
            try {
                const response = await api.get(`/projects/${projectId}`)
                return response.data
            } catch (error) {
                console.error('Error fetching project:', error)
                throw error
            }
        },

        createProject: async (projectData) => {
            try {
                if (isDemo) {
                    throw new Error('Creating new projects is not available in demo mode')
                }
                const response = await api.post('/projects/newProject', projectData)
                return response.data
            } catch (error) {
                if (error.response?.status === 403 && error.response.data?.message?.includes('demo')) {
                    throw new Error('Creating new projects is not available in demo mode')
                }
                console.error('Error creating project:', error)
                throw error
            }
        },

        updateProject: async (projectId, updatedData) => {
            try {
                if (isDemo) {
                    throw new Error('Project modifications are not available in demo mode')
                }
                const response = await api.put(`/projects/${projectId}`, updatedData)
                return response.data
            } catch (error) {
                if (error.response?.status === 403 && error.response.data?.message?.includes('demo')) {
                    throw new Error('Project modifications are not available in demo mode')
                }
                console.error('Error updating project:', error)
                throw error
            }
        },

        deleteProject: async (projectId) => {
            try {
                if (isDemo) {
                    throw new Error('Project deletion is not available in demo mode')
                }
                const response = await api.delete(`/projects/${projectId}`)
                return response.data
            } catch (error) {
                if (error.response?.status === 403 && error.response.data?.message?.includes('demo')) {
                    throw new Error('Project deletion is not available in demo mode')
                }
                console.error('Error deleting project:', error)
                throw error
            }
        },

        addTeamMember: async (projectId, userId, role) => {
            try {
                if (isDemo) {
                    throw new Error('Team modifications are not available in demo mode')
                }
                const response = await api.post(`/projects/${projectId}/team`, { userId, role })
                return response.data
            } catch (error) {
                if (error.response?.status === 403 && error.response.data?.message?.includes('demo')) {
                    throw new Error('Team modifications are not available in demo mode')
                }
                console.error('Error adding team member:', error)
                throw error
            }
        },

        removeTeamMember: async (projectId, userId) => {
            try {
                if (isDemo) {
                    throw new Error('Team modifications are not available in demo mode')
                }
                const response = await api.delete(`/projects/${projectId}/team/${userId}`)
                return response.data
            } catch (error) {
                if (error.response?.status === 403 && error.response.data?.message?.includes('demo')) {
                    throw new Error('Team modifications are not available in demo mode')
                }
                console.error('Error removing team member:', error)
                throw error
            }
        },

        updateKanbanColumns: async (projectId, columns) => {
            try {
                if (isDemo) {
                    throw new Error('Kanban modifications are not available in demo mode')
                }
                const response = await api.put(`/projects/${projectId}/kanban`, {columns})
                return response.data
            } catch (error) {
                if (error.response?.status === 403 && error.response.data?.message?.includes('demo')) {
                    throw new Error('Kanban modifications are not available in demo mode')
                }
                console.error('Error updating kanban columns:', error)
                throw error
            }
        },

        fetchTasksAtRisk: async (projectId) => {
            try {
                const response = await api.get(`/tasks/project/${projectId}/at-risk`)
                return response.data
            } catch (error) {
                console.error('Error fetching at-risk tasks:', error)
                throw error
            }
        },

        updateTaskRiskStatus: async (projectId, taskId, riskData) => {
            try {
                if (isDemo) {
                    throw new Error('Risk status modifications are not available in demo mode')
                }
                const response = await api.put(`/projects/${projectId}/tasks/${taskId}/risk`, riskData)
                return response.data
            } catch (error) {
                if (error.response?.status === 403 && error.response.data?.message?.includes('demo')) {
                    throw new Error('Risk status modifications are not available in demo mode')
                }
                console.error('Error updating task risk status:', error)
                throw error
            }
        },

        transferOwnership: async (projectId, newOwnerId) => {
            try {
                if (isDemo) {
                    throw new Error('Ownership transfer is not available in demo mode')
                }
                const response = await api.put(`/projects/${projectId}/transfer`, { newOwnerId })
                return response.data
            } catch (error) {
                if (error.response?.status === 403 && error.response.data?.message?.includes('demo')) {
                    throw new Error('Ownership transfer is not available in demo mode')
                }
                console.error('Error transferring project ownership:', error)
                throw error
            }
        }
    }
}

export default useProjectService
