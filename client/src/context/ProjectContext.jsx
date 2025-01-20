import { createContext, useState, useCallback, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import useProjectService from "../services/projectService"
import { useAuth } from './AuthContext'
import { createInitialProjectData } from '../utils/projectDataUtils'

const ProjectContext = createContext()

export const useProjectContext = () => {
    return useContext(ProjectContext)
}

export const ProjectProvider = ({ children }) => {
    const [projectData, setProjectData] = useState(null)
    const [projectList, setProjectList] = useState([])
    const [currentProject, setCurrentProject] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [lastRefresh, setLastRefresh] = useState(Date.now())
    const [tasksAtRisk, setTasksAtRisk] = useState([])
    const [riskLoading, setRiskLoading] = useState(false)
    const [lastUpdate, setLastUpdate] = useState(Date.now())
    const [transferringOwnership, setTransferringOwnership] = useState(false)
    const { currentUser, authError } = useAuth()
    const projectService = useProjectService()

    const refreshDashboard = useCallback(() => {
        setLastRefresh(Date.now())
    }, [])

    const fetchProjects = useCallback(async () => {
        if (!currentUser || authError) {
            setProjectList([])
            setErrors(prevErrors => ({ ...prevErrors, fetch: 'User not authenticated' }))
            return
        }
        setLoading(true)
        try {
            const projects = await projectService.fetchProjectList()
            setProjectList(projects)
            if (projects.length === 0) {
                setErrors(prevErrors => ({ ...prevErrors, fetch: 'No projects found' }))
            } else {
                setErrors({})
            }
        } catch (error) {
            console.error('Error fetching projects:', error)
            setErrors(prevErrors => ({ ...prevErrors, fetch: 'Failed to fetch projects' }))
            setProjectList([])
        } finally {
            setLoading(false)
        }
    }, [currentUser, authError, projectService])

    const setProject = useCallback(async (projectId) => {
        try {
            const project = await projectService.fetchProject(projectId)
            setCurrentProject(project)
            setProjectData(project)
        } catch(error) {
            console.error('Error setting project:', error)
            setErrors(prevErrors => ({ ...prevErrors, setProject: 'Failed to set project' }))
        }
    }, [projectService])

    const createNewProject = useCallback(async () => {
        try {
            const initialProjectData = createInitialProjectData()
            const newProject = await projectService.createProject(initialProjectData)
            setProjectList(prevList => [...prevList, newProject])
            setCurrentProject(newProject)
            setProjectData(newProject)
            return newProject
        } catch (error) {
            console.error('Error creating project:', error)
            setErrors(prevErrors => ({ ...prevErrors, create: 'Failed to create project' }))
            return null
        }
    }, [projectService])

    const updateCurrentProject = useCallback(async (updatedData) => {
        if(!currentProject) return
        try {
            const updatedProject = await projectService.updateProject(currentProject._id, updatedData)
            setProjectList(prevList => prevList.map(p => p._id === updatedProject._id ? updatedProject : p))
            setProjectData(updatedProject)
            setCurrentProject(updatedProject)
            setLastUpdate(Date.now())
        } catch (error) {
            console.error('Error updating project:', error)
            setErrors(prevErrors => ({ ...prevErrors, updateProject: 'Failed to update project' }))
        }
    }, [currentProject, projectService])

    const deleteCurrentProject = useCallback(async () => {
        if(!currentProject) return
        try {
            await projectService.deleteProject(currentProject._id)
            setProjectList(prevList => prevList.filter(p => p._id !== currentProject._id))
            setCurrentProject(null)
            setProjectData()
        } catch (error) {
            console.error('Error deleting project:', error)
            setErrors(prevErrors => ({ ...prevErrors, deleteProject: 'Failed to delete project' }))
        }
    }, [currentProject, projectService])

    const addTeamMember = useCallback(async (userId, role) => {
        if (!currentProject) return
        try {
            const updatedProject = await projectService.addTeamMember(currentProject._id, userId, role)
            setCurrentProject(updatedProject)
            setProjectData(updatedProject)
        } catch (error) {
            console.error('Error adding team member:', error)
            setErrors(prevErrors => ({ ...prevErrors, addMember: 'Failed to add team member' }))
        }
    }, [currentProject, projectService])

    const removeTeamMember = useCallback(async (userId) => {
        if(!currentProject) return
        try {
            const updatedProject = await projectService.removeTeamMember(currentProject._id, userId)
            setCurrentProject(updatedProject)
            setProjectData(updatedProject)
        } catch (error) {
            console.error('Error removing team member:', error)
            setErrors(prevErrors => ({ ...prevErrors, removeTeamMember: 'Failed to remove team member' }))
        }
    }, [currentProject, projectService])

    const updateKanbanColumns = useCallback(async (columns) => {
        if(!currentProject) return
        try {
            const updatedProject = await projectService.updateKanbanColumns(currentProject._id, columns)
            setCurrentProject(updatedProject)
            setProjectData(updatedProject)
        } catch (error) {
            console.error('Error updating kanban columns:', error)
            setErrors(prevErrors => ({ ...prevErrors, updateKanbanColumns: 'Failed to update kanban columns' }))
        }
    }, [currentProject, projectService])

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setProjectData(prevData => ({
        ...prevData,
        [id]: value
        }))
    }

    const handleOptionsChange = useCallback((updatedOption) => {
        setProjectData(prevData => ({
        ...prevData,
        options: {
            ...prevData.options,
            ...updatedOption
        }
        }))
    }, [])

    const handleDateChange = (field, date) => {
        setProjectData(prevData => ({
        ...prevData,
        [field]: date,
        }))
    }

    const handleAddTeamMember = (newMember) => {
        setProjectData(prevData => ({
        ...prevData,
        team: [...prevData.team, newMember]
        }))
    }

    const handleToggleAdmin = useCallback((memberId) => {
        setProjectData(prevData => ({
            ...prevData,
            team: prevData.team.map(member =>
                member.id === memberId
                ? { ...member, admin: !member.admin }
                : member
            )
        }))
    }, [])

    const handleDeleteMember = (memberId) => {
        setProjectData(prevData => ({
        ...prevData,
        team: prevData.team.filter(member => member.id !== memberId)
        }))
    }

    const fetchTasksAtRisk = useCallback(async () => {
        if (!currentProject?._id) return

        setRiskLoading(true)
        try {
            const riskTasks = await projectService.fetchTasksAtRisk(currentProject._id)
            setTasksAtRisk(riskTasks)
        } catch (error) {
            console.error('Error fetching risks:', error)
            setErrors(prevErrors => ({ ...prevErrors, risks: 'Failed to fetch risks' }))
        } finally {
            setRiskLoading(false)
        }
    }, [currentProject?._id, projectService])

    const updateTaskRisk = useCallback(async (taskId, riskData) => {
        if (!currentProject?._id) return

        try {
            const updatedTask = await projectService.updateTaskRiskStatus(
                currentProject._id,
                taskId,
                riskData
            )

            setTasksAtRisk(prevTasks => {
                if (riskData.isAtRisk) {
                    const exists = prevTasks.some(task => task._id === taskId)
                    if (exists) {
                        return prevTasks.map(task =>
                            task._id === taskId ? updatedTask : task
                        )
                    }
                    return [...prevTasks, updatedTask]
                } else {
                    return prevTasks.filter(task => task._id !== taskId)
                }
            })

            setCurrentProject(prev => ({
                ...prev,
                tasks: prev.tasks.map(task =>
                    task._id === taskId ? updatedTask : task
                )
            }))
        } catch (error) {
            console.error('Error updating task risk:', error)
            setErrors(prevErrors => ({
                ...prevErrors,
                taskRisk: 'Failed to update task risk status'
            }))
        }
    }, [currentProject?._id, projectService])

    useEffect(() => {
        if (currentProject?._id) {
            fetchTasksAtRisk()
        }
    }, [currentProject?._id])

    const transferOwnership = useCallback(async (newOwnerId) => {
        if (!currentProject) return
        setTransferringOwnership(true)
        try {
            const updatedProject = await projectService.transferOwnership(
                currentProject._id,
                newOwnerId
            )
            setCurrentProject(updatedProject)
            return updatedProject
        } catch (error) {
            console.error('Error transferring ownership:', error)
            throw error
        } finally {
            setTransferringOwnership(false)
        }
    }, [currentProject, projectService])

    const value = {
        projectData,
        setProjectData,
        projectList,
        currentProject,
        isModalOpen,
        setIsModalOpen,
        handleInputChange,
        handleOptionsChange,
        handleDateChange,
        handleAddTeamMember,
        handleToggleAdmin,
        handleDeleteMember,
        errors,
        setErrors,
        loading,
        fetchProjects,
        setProject,
        createNewProject,
        updateCurrentProject,
        deleteCurrentProject,
        addTeamMember,
        removeTeamMember,
        updateKanbanColumns,
        lastRefresh,
        refreshDashboard,
        tasksAtRisk,
        riskLoading,
        updateTaskRisk,
        fetchTasksAtRisk,
        transferOwnership,
        transferringOwnership,
        lastUpdate
    }

    return (
        <ProjectContext.Provider value={value}>
        {children}
        </ProjectContext.Provider>
    )
}

ProjectProvider.propTypes = {
    children: PropTypes.node.isRequired
}
