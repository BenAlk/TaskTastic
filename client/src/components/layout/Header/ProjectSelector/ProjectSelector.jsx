import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { DownArrowIcon, EditIcon, CreateIcon, TrashIcon } from '../../../../assets/icons'
import styles from "./ProjectSelector.module.css"
import { useProjectContext } from "../../../../context/ProjectContext"
import { useAuth } from "../../../../context/AuthContext"

const ProjectSelector = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const containerRef = useRef(null)
    const [showArrows, setShowArrows] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)


    const {
        projectList,
        currentProject,
        setProject,
        deleteCurrentProject,
        fetchProjects,
        loading,
        createNewProject,
    } = useProjectContext()

    const updateArrowVisibility = () => {
        if (containerRef.current) {
            const container = containerRef.current
            setShowArrows(container.scrollWidth > container.clientWidth)
        }
    }

    useEffect(() => {
        fetchProjects()
        console.log(currentProject)
    }, [])

    useEffect(() => {
        updateArrowVisibility()
        window.addEventListener('resize', updateArrowVisibility)

        return () =>
            window.removeEventListener('resize', updateArrowVisibility)
    }, [projectList])

    const handleScroll = (direction) => {
        const container = containerRef.current
        if (!container) return

        const itemWidth = container.offsetWidth / 3
        const totalItems = projectList.length

        let newIndex
        if (direction === 'next') {
            newIndex = Math.min(currentIndex + 3, totalItems - 3)
        } else {
            newIndex = Math.max(currentIndex - 3, 0)
        }

        setCurrentIndex(newIndex)
        container.scrollTo({
            left: newIndex * itemWidth,
            behavior: 'smooth',
        })
    }

    const handleProjectClick = (project) => {
        setProject(project._id)
        if(location.pathname === "/create-project") {
            navigate("/")
        }
    }

    const handleCreateNewProject = async () => {
        try {
            const newProject = await createNewProject()
            if (newProject) {
                setProject(newProject._id)
                navigate("/create-project")
            }
        } catch (error) {
            console.error("Error creating new project:", error)
            // You might want to show an error message to the user here
        }
    }

    const handleDeleteProject = async (projectId) => {
        if(window.confirm("Are you sure you want to delete this project?")) {
            await deleteCurrentProject(projectId)
            fetchProjects()
        }
    }

    if (loading) {
        return <div>Loading projects...</div>;
    }

    // if (error) {
    //     return <div>Error loading projects: {error}</div>;
    // }

    if (!projectList || projectList.length === 0) {
        return (
            <div className={styles['dashboard-project-selector-no-projects']}>
                <div className={styles['no-projects-message']}>
                    No projects available, create your first project!
                </div>
                <div className={styles['create-new-project-button']} onClick={handleCreateNewProject}>
                    <CreateIcon  height={"1.5rem"} width={"1.5rem"} backgroundFill='green' />
                </div>
            </div>
        );
    }

    return (
        <div className={styles['dashboard-project-selector']}>
            <div className={styles['dashboard-project-selector-label']}>Select a project</div>
            {showArrows && (
                <button onClick={() => handleScroll('prev')} className={styles['arrow-button']}>
                    <ArrowIcon />
                </button>
            )}
            <div ref={containerRef} className={styles['project-list-container']}>
                {projectList?.map((project) => (
                    <div
                        key={project._id}
                        className={`${styles['project-item']} ${currentProject?._id === project._id ? styles['active'] : ''}`}
                        onClick={() => handleProjectClick(project)}
                    >
                        {project.projectName}
                    </div>
                ))}
            </div>
            {showArrows && (
                <button onClick={() => handleScroll('next')} className={styles['arrow-button']}>
                    <ArrowIcon />
                </button>
            )}
            <div className={styles['create-new-project-button']} onClick={handleCreateNewProject}>
                <CreateIcon height={"1.5rem"} width={"1.5rem"} backgroundFill='green' />
            </div>
        </div>
    );
};

export default ProjectSelector
