import PropTypes from 'prop-types'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import dayjs from 'dayjs'
import NewProjectDetails from '../../components/NewProjectDetails/NewProjectDetails'
import { NewTeamMemberTile, TeamMember } from '../../components/NewTeamMemberTile/NewTeamMemberTile'
import { createMemberTemplate, isValidMember } from '../../components/NewTeamMemberTile/memberTemplate'
import ChoiceSelector from '../../components/ChoiceSelector/ChoiceSelector'
import Modal from '../../components/Modal/Modal'
import { activeTeamMember } from '../../components/NewProjectDetails/testData/testData'
import "./styles/CreateProject.css"

const CreateProject = () => {
    const { isSideBarOpen } = useOutletContext()
    const [projectData, setProjectData] = useState({
        name: "",
        owner: "Ben Alkureishi",
        createdDate: dayjs().format('D MMMM, YYYY'),
        startDate: dayjs(),
        targetDate: dayjs().add(1, 'month'),
        team: {
            members:[]
        }
    })
    const [selectedMember, setSelectedMember] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [displayTeamMember, setDisplayTeamMember] = useState(null)

    const handleInputChange = (e) => {
        const {id, value} = e.target
        setProjectData(prevData => ({
            ...prevData,
            [id]: value
        }))
    }

    const handleStartDateChange = (date) => {
        setProjectData(prevData => ({
            ...prevData,
            startDate: date,
        }))
    }

    const handleTargetDateChange = (date) => {
        setProjectData(prevData => ({
            ...prevData,
            targetDate: date,
        }))
    }

    // const handleAddTeamMember = () => {
    //     const newMember = createMemberTemplate();
    //     setProjectData(prevData => ({
    //     ...prevData,
    //     team: {
    //         ...prevData.team,
    //         members: [...prevData.team.members, newMember]
    //     }
    //     }));
    //     console.log(projectData.team.members);
    // };

    const handleAddTeamMember = () => {
        setIsModalOpen(true); // Open the modal when clicking on NewTeamMemberTile
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleModalSubmit = (newMember) => {
        setProjectData(prevData => ({
            ...prevData,
            team: {
                ...prevData.team,
                members: [...prevData.team.members, newMember]
            }
        }));
        setIsModalOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log({
            ...projectData,
        startDate: projectData.startDate.format('D MMMM, YYYY'),
        targetDate: projectData.targetDate.format('D MMMM, YYYY')
    })
    }

    const datePickerStyles = {
        '& .MuiInputBase-root': {
            height: '1.5em',
            width: '10em' // Adjust this value to change the height
        },
        '& .MuiInputBase-input': {
            textAlign: 'center',
        },
        '& fieldset': {
            border: '1px solid var(--primary-color)',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        },
    }

    const handleSetDisplayTeamMember = (member) => {
        setDisplayTeamMember(member)
    }

    return (
        <div className={`main-container ${isSideBarOpen ? "" : "slide"}`}>
            <form className="new-project-container" onSubmit={handleSubmit}>
                <div className="new-project-header">
                    <div className="new-project-name">
                        <label htmlFor="newProjectName" className="new-project-name-label">Project Name:</label>
                        <input
                            type="text"
                            className="new-project-name-input"
                            id="newProjectName"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="new-project-owner">
                        <label htmlFor="newProjectOwner" className="new-project-owner-label">Owner:</label>
                        <input
                            type="text"
                            className="new-project-owner-input"
                            id="newProjectOwner"
                            value={projectData.owner}
                            disabled
                        />
                    </div>
                    <div className="new-project-created-date">
                        <label htmlFor="newProjectCreatedDate" className="new-project-created-date-label">Date Created:</label>
                        <input type="text" className="new-project-created-date-input" id="newProjectCreatedDate" value={projectData.createdDate} disabled />
                    </div>
                    <button type="submit" className="new-project-submit-button">Submit</button>
                </div>
                <div className="project-body">
                    <NewProjectDetails datePickerStyles={datePickerStyles} projectData={projectData} handleStartDateChange={handleStartDateChange} handleTargetDateChange={handleTargetDateChange} />
                    <div className="new-project-team">
                        <div className="new-project-team-title">
                            <h3>Select Team Members</h3>
                        </div>
                        <div className="new-project-team-container">
                            <div className="new-project-team-tile-container">
                            {projectData.team.members.map((member, index) => (
                                    <TeamMember key={index} member={member} onClick={handleSetDisplayTeamMember} />
                                ))}
                                <NewTeamMemberTile onAddTeamMember={handleAddTeamMember} />
                            </div>
                            <div className="new-project-team-member-information">
                                <div className="team-member-selectors">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="new-project-kanban"></div>
                </div>
            </form>
            <Modal isOpen={isModalOpen} onClose={handleModalClose} className={"new-team-member-modal"}>
                <h2>Add Team Member</h2>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const newMember = createMemberTemplate();
                    handleModalSubmit(newMember);
                }}>
                    <div className="existing-team-members">
                    <p>Select an existing team member:</p>
                    <select
                            className="active-members"
                            value={selectedMember}
                            onChange={(e) => setSelectedMember(e.target.value)}
                        >
                            <option value="">Select a member</option>
                            {activeTeamMember.activeTeam.map((member) => (
                                <option key={member.id} value={member.id}>
                                    {member.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default CreateProject

CreateProject.propTypes = {
    isSideBarOpen: PropTypes.bool
}
