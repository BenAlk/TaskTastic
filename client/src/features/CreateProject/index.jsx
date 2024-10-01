import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { createInitialProjectData } from './utils/projectDataUtils'
import ProjectHeader from './components/ProjectHeader/ProjectHeader'
import ProjectBody from './components/ProjectBody/ProjectBody'
import AddTeamMemberModal from './components/AddTeamMemberModal/AddTeamMemberModal'
import "./styles/CreateProject.css"

const owner = {
    id: 1,
    name: "Test Owner",
    email: "testOwner@hotmail.co.uk",
    avatar: "https://ui-avatars.com/api/?background=ff0000&color=fff&name=Test+Owner",
    role: "Project Manager",
    color: "ff000",
    admin: true,
}

const CreateProject = () => {
    const { isSideBarOpen } = useOutletContext()
    const [projectData, setProjectData] = useState(createInitialProjectData(owner))
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleInputChange = (e) => {
        const { id, value } = e.target
        setProjectData(prevData => ({
            ...prevData,
            [id]: value
        }))
    }

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

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(projectData)
    }

    return (
        <div className={`main-container ${isSideBarOpen ? "" : "slide"}`}>
            <form className="new-project-container" onSubmit={handleSubmit}>
                <ProjectHeader
                    projectData={projectData}
                    handleInputChange={handleInputChange}
                />
                <ProjectBody
                    projectData={projectData}
                    handleDateChange={handleDateChange}
                    setIsModalOpen={setIsModalOpen}
                />
            </form>
            <AddTeamMemberModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddMember={handleAddTeamMember}
                existingTeam={projectData.team}
                user={owner}
            />
        </div>
    )
}

export default CreateProject
