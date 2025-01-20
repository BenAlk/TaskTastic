import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { LeftArrowIcon, RightArrowIcon, CreateIcon, EditIcon, TrashIcon } from '../../../../assets/icons'
import styles from "./ProjectSlider.module.css"
import { useProjectContext } from "../../../../context/ProjectContext"
import CreateProjectModal from './CreateProjectModal/CreateProjectModal'
import EditProjectModal from './EditProjectModal/EditProjectModal'
import DeleteProjectModal from './DeleteProjectModal/DeleteProjectModal'

const ProjectSlider = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const containerRef = useRef(null)
    const projectRefs = useRef({})
    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(true)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    const {
        projectList,
        currentProject,
        setProject,
        deleteCurrentProject,
        fetchProjects,
        loading,
        createNewProject,
    } = useProjectContext()

    useEffect(() => {
        fetchProjects()                                         // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleProjectClick = (project) => {
        setProject(project._id)
        if (location.pathname === "/create-project") {
            navigate("/dashboard", { state: { activeProject: project } })
        }
        scrollToProject(project._id)
    }

    useEffect(() => {
        fetchProjects()                                          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const activeProject = location.state?.activeProject
        if (activeProject) {
            setProject(activeProject._id)
            scrollToProject(activeProject._id)
        }                                                       // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location])

    const handleCreateNewProject = async () => {
        try {
            const newProject = await createNewProject()
            if (newProject) {
                setIsCreateModalOpen(true)
            }
        } catch (error) {
            console.error("Error creating new project:", error)
        }
    }

    const handleEditProject = () => {
        if (!currentProject) return
        setIsEditModalOpen(true)
    }

    const handleDeleteProject = () => {
        if (!currentProject) return
        setIsDeleteModalOpen(true)
    }

    const handleConfirmDelete = async () => {
        await deleteCurrentProject()
    }

    const scrollToProject = (projectId) => {
        if (projectRefs.current[projectId]) {
            projectRefs.current[projectId].scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            })
        }
    }

    useEffect(() => {
        if (currentProject?._id) {
            scrollToProject(currentProject._id)
        }
    }, [currentProject])

    const checkScrollPosition = () => {
        if (containerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = containerRef.current
            setShowLeftArrow(scrollLeft > 0)
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1)
        }
    }

    useEffect(() => {
        checkScrollPosition()
        const container = containerRef.current
        if (container) {
            container.addEventListener('scroll', checkScrollPosition)
            return () => container.removeEventListener('scroll', checkScrollPosition)
        }
    }, [projectList])

    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft -= 200
        }
    }

    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollLeft += 200
        }
    }

    if (loading) {
        return <div>Loading projects...</div>
    }

    if (!projectList || projectList.length === 0) {
        return (
            <div className={styles['no-projects-selection-container']}>
            <div className={styles['no-projects-slider-container']}>
                <div className={styles['no-projects-message']}>
                    No projects available, create your first project!
                </div>
                <div className={styles['create-new-project-button']} onClick={handleCreateNewProject}>
                    <CreateIcon  height={"1.25rem"} width={"1.25rem"} backgroundFill='transparent' className={styles['icon']} title={"Create New Project"}/>
                </div>
            </div>
            </div>
        )
    }


    return (
        <div className={styles['project-selection-container']}>
            <div className={styles['project-selection-title']}>Select a project</div>
            <div className={styles['project-slider-container']}>
                <div
                    className={`${styles['left-arrow']} ${showLeftArrow && styles['active']}`}
                    onClick={scrollLeft}
                >
                    <LeftArrowIcon className={styles['arrow-icon']} />
                </div>
                <ul className={styles['project-list']} ref={containerRef}>
                    {projectList?.map((project) => (
                        <li key={project._id} ref={el => projectRefs.current[project._id] = el}>
                            <div className={`${styles['project-selector']} ${currentProject?._id === project._id ? styles['active'] : ''}`} onClick={() => handleProjectClick(project)}>
                                {project.projectName}
                            </div>
                        </li>
                    ))}
                </ul>
                <div
                    className={`${styles['right-arrow']} ${showRightArrow && styles['active']}`}
                    onClick={scrollRight}
                >
                    <RightArrowIcon className={styles['arrow-icon']} />
                </div>
            </div>
            <div className={styles['project-selection-icons']}>
                <div className={styles['create-new-project-button']} onClick={handleCreateNewProject} title={"Create New Project"}>
                    <CreateIcon  height={"1.25rem"} width={"1.25rem"} backgroundFill='transparent' className={styles['icon']} title={"Create New Project"}/>
                </div>
                <div className={`${styles['edit-current-project-button']} ${!currentProject ? styles['disabled'] : ''}`} title={"Edit Project"} onClick={handleEditProject}>
                    <EditIcon  height={"1.25rem"} width={"1.25rem"} className={styles['icon']} title={"Edit Project"}/>
                </div>
                <div
                    className={`${styles['delete-current-project-button']} ${!currentProject ? styles['disabled'] : ''}`}
                    title="Delete Project"
                    onClick={handleDeleteProject}
                >
                    <TrashIcon  height={"1.25rem"} width={"1.25rem"} className={styles['icon']} title={"Delete Project"}/>
                </div>
            </div>
            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
            <EditProjectModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />
            <DeleteProjectModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                projectId={currentProject?._id}
                projectName={currentProject?.projectName}
            />
        </div>
    )
}

export default ProjectSlider
