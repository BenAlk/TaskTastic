import { useContext } from 'react'
import { ProjectContext } from '../../ProjectContext'
import "./styles/ProjectHeader.css"

const ProjectHeader = () => {
    const { projectData, handleInputChange } = useContext(ProjectContext)

    return (
        <div className="new-project-header">
            <div className="new-project-name">
                <label htmlFor="name" className="new-project-name-label">Project Name:</label>
                <input
                    type="text"
                    className="new-project-name-input"
                    id="name"
                    value={projectData.name}
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
    )
}

export default ProjectHeader
