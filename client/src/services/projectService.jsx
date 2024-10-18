import { useAuth } from '../context/AuthContext'

const useProjectService = () => {
    const { api } = useAuth()

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
                const response = await api.post('/projects/newProject', projectData)
                return response.data
            } catch (error) {
                console.error('Error creating project:', error)
                throw error
            }
        },

        updateProject: async (projectId, updatedData) => {
            try {
                const response = await api.put(`/projects/${projectId}`, updatedData)
                return response.data
            } catch (error) {
                console.error('Error updating project:', error)
                throw error
            }
        },

        deleteProject: async (projectId) => {
            try {
                const response = await api.delete(`/projects/${projectId}`)
                return response.data
            } catch (error) {
                console.error('Error deleting project:', error)
                throw error
            }
        },

        addTeamMember: async (projectId, userId, role) => {
            try {
                const response = await api.post(`/projects/${projectId}/team`, { userId, role })
                return response.data
            } catch (error) {
                console.error('Error adding team member:', error)
                throw error
            }
        },

        removeTeamMember: async (projectId, userId) => {
            try {
                const response = await api.delete(`/projects/${projectId}/team/${userId}`)
                return response.data
            } catch (error) {
                console.error('Error removing team member:', error)
                throw error
            }
        },

        updateKanbanColumns: async (projectId, columns) => {
            try {
                const response = await api.put(`/projects/${projectId}/kanban`, {columns})
                return response.data
            } catch (error) {
                console.error('Error updating kanban columns:', error)
                throw error
            }
        }
    }
}

export default useProjectService
