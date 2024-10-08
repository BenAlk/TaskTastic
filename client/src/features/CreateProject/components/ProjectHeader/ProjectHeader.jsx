import { useContext } from 'react'
import { ProjectContext } from '../../ProjectContext'
import { LayoutContext } from "../../../../pages/Layout/index"
import "./styles/ProjectHeader.css"
import PropTypes from "prop-types"

const ProjectHeader = ({handleSubmit}) => {
    const { projectData, handleInputChange } = useContext(ProjectContext)
    const { errors, setErrors } = useContext(LayoutContext)


    const validateField = (name, value) => {
        if (name === 'name' && !value.trim()) {
            setErrors(prev => ({
                ...prev, name: 'Please enter a name for the project'
            }))
            return 'Please enter a name for the project'
        }
    }

    const onClickSubmit = (e) => {
        validateField('name', projectData.name)
        if (Object.keys(errors).length === 0) {
            handleSubmit(e)
        }
    }

    return (
        <div className="new-project-header">
            <div className="new-project-name">
                <label htmlFor="name" className="new-project-name-label">Project Name:</label>
                <input
                    type="text"
                    className={`new-project-name-input ${errors.name ? 'input-error' : ''}`}
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
            <div className="submit-project" onClick={onClickSubmit}>Submit</div>
            {/* <button type="submit" className="new-project-submit-button">Submit</button> */}
        </div>
    )
}

ProjectHeader.propTypes = {
    handleSubmit: PropTypes.func.isRequired
}

export default ProjectHeader
