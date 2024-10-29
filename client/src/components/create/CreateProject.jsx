import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useProjectContext } from '../../context/ProjectContext';
import ProjectInformation  from "./sections/Info/ProjectInformation"
import TeamSelection from "./sections/Team/TeamSelection"
import KanbanSetup from "./sections/Kanban/KanbanSetup"
import styles from "./CreateProject.module.css"

const CreateProject = () => {

    const navigate = useNavigate()
    const location = useLocation()
    const {
        projectData,
        updateCurrentProject,
        deleteCurrentProject,
    } = useProjectContext()

    const [activeSection, setActiveSection] = useState('projectInfo')
    const [formData, setFormData] = useState({
        projectName: projectData?.projectName || '',
        startDate: projectData?.startDate || new Date().toISOString().split('T')[0],
        targetDate: projectData?.targetDate || '',
        secondaryAdminsAllowed: projectData?.secondaryAdminsAllowed || false,
        eisenhowerEnabled: projectData?.eisenhowerEnabled || false,
        team: projectData?.team || [],
        kanbanColumns: projectData?.kanbanColumns || [
            { name: 'To Do', color: '#E2E8F0', maxDays: 0, maxTasks: 0, order: 0 },
            { name: 'In Progress', color: '#93C5FD', maxDays: 5, maxTasks: 5, order: 1 },
            { name: 'Done', color: '#86EFAC', maxDays: 0, maxTasks: 0, order: 2 }
        ]
    })

    const [errors, setErrors] = useState({})

    useEffect(() => {
        return () => {
            if (!location.pathname.includes('/create-project')) {
                deleteCurrentProject()
            }
        }
}, [location, deleteCurrentProject])


    const handleNext = () => {
        const sections = ['projectInfo', 'teamSelection', 'kanbanSetup']
        const currentIndex = sections.indexOf(activeSection)
        if (currentIndex < sections.length - 1) {
            setActiveSection(sections[currentIndex + 1])
        }
        console.log("moving section forward")
    }

    const handleBack = () => {
        const sections = ['projectInfo', 'teamSelection', 'kanbanSetup']
        const currentIndex = sections.indexOf(activeSection)
        if (currentIndex > 0) {
            setActiveSection(sections[currentIndex - 1])
        }
    }

    const handleSave = async () => {
        try {
            await updateCurrentProject(formData)
            navigate('/dashboard')
        } catch (error) {
            setErrors(prev => ({ ...prev, save: 'Failed to save project' }))
        }
    }

    return (
        <div className={styles['create-project-container']}>
            <div className={styles['create-project-header']}>
                <h1 className={styles['create-project-title']}>Create New Project</h1>
                <div className={styles['create-project-navigation-buttons']}>
                    {activeSection !== 'projectInfo' && (
                        <button
                            onClick={handleBack}
                            className={styles['create-project-navigation-button']}
                        >
                            Back
                        </button>
                        )}
                    {activeSection !== 'kanbanSetup' ? (
                        <button
                            onClick={handleNext}
                            className={styles['create-project-navigation-button']}
                        >
                            Next
                        </button>
                    ) : (
                        <button
                            onClick={handleSave}
                            className={styles['create-project-navigation-button']}
                        >
                            Save
                        </button>
                    )}
                </div>
            </div>

            {activeSection === 'projectInfo' && (
                <ProjectInformation
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                />
            )}

            {activeSection === 'teamSelection' && (
                <TeamSelection
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                />
            )}

            {activeSection === 'kanbanSetup' && (
                <KanbanSetup
                    formData={formData}
                    setFormData={setFormData}
                    errors={errors}
                />
            )}
        </div>
    );
};

export default CreateProject;
