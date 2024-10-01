import PropTypes from 'prop-types'
import NewProjectDetails from '../NewProjectDetails/NewProjectDetails'
import TeamDetails from '../TeamDetails/TeamDetails'
import "./styles/ProjectBody.css"

const ProjectBody = ({ projectData, handleDateChange, setIsModalOpen }) => {
    const datePickerStyles = {
        '& .MuiInputBase-root': {
            height: '1.5em',
            width: '10em'
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
        <div className="project-body">
            <NewProjectDetails
                projectData={projectData}
                handleStartDateChange={(date) => handleDateChange('startDate', date)}
                handleTargetDateChange={(date) => handleDateChange('targetDate', date)}
                datePickerStyles={datePickerStyles}
            />
            <TeamDetails
                team={projectData.team}
                onAddTeamMember={() => setIsModalOpen(true)}
            />
        </div>
    )
}

ProjectBody.propTypes = {
    projectData: PropTypes.object.isRequired,
    handleDateChange: PropTypes.func.isRequired,
    setIsModalOpen: PropTypes.func.isRequired
}

export default ProjectBody
