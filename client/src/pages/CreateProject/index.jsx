import PropTypes from 'prop-types'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import dayjs from 'dayjs'
import NewProjectDetails from '../../components/NewProjectDetails/NewProjectDetails'
import { AddIcon } from '../../assets/icons'
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
            members:[{
                name: "",
                role: "",
                email: "",
                customColor: "",
                added: "false", // true or false or pending is team member is not an account holder.
                avatar: ""
                }
            ]
        }
    })

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
                            <div className="new-project-team-card-container">
                                <div className="new-project-team-member-card added-card">
                                    <div className="add-member-icon "><AddIcon width="28px" height="28px" /></div>
                                </div>
                                <div className="new-project-team-member-card active-card">
                                    <AddIcon width="28px" height="28px" className="add-member-icon active-icon" />
                                </div>

                            </div>
                            <div className="new-project-team-member-information">
                            </div>
                        </div>
                    </div>
                    <div className="new-project-kanban"></div>
                </div>
            </form>
        </div>
    )
}

export default CreateProject

CreateProject.propTypes = {
    isSideBarOpen: PropTypes.bool
}
