import { useContext } from 'react'
import { useOutletContext } from 'react-router-dom'
import { ProjectProvider, ProjectContext } from './ProjectContext'
import ProjectHeader from './components/ProjectHeader/ProjectHeader'
import ProjectBody from './components/ProjectBody/ProjectBody'
import AddTeamMemberModal from './components/AddTeamMemberModal/AddTeamMemberModal'
import "./styles/CreateProject.css"

const CreateProjectContent = () => {
    const { isSideBarOpen } = useOutletContext()
    const { projectData, isModalOpen, setIsModalOpen } = useContext(ProjectContext)

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(projectData)
    }

    return (
        <div className={`main-container ${isSideBarOpen ? "" : "slide"}`}>
            <form className="new-project-container" onSubmit={handleSubmit}>
                <ProjectHeader />
                <ProjectBody />
            </form>
            <AddTeamMemberModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    )
}

const CreateProject = () => (
    <ProjectProvider >
        <CreateProjectContent />
    </ProjectProvider>
)

export default CreateProject
