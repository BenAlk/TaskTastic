import { useContext } from 'react'
import { ProjectContext } from '../../ProjectContext'
import NewProjectDetails from '../NewProjectDetails/NewProjectDetails'
import TeamDetails from '../TeamDetails/TeamDetails'
import KanbanDetails from '../KanbanDetails/KanbanDetails'
import "./styles/ProjectBody.css"

const ProjectBody = () => {
    const { setIsModalOpen } = useContext(ProjectContext)

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
        '& .MuiInputAdornment-root .MuiIconButton-root': {
            padding: '4px',
        },
        '& .MuiInputAdornment-root .MuiIconButton-root:hover': {
            padding: '4px',  // Reduced padding on hover
        },
        '& .MuiInputAdornment-root .MuiIconButton-root .MuiSvgIcon-root': {
            fontSize: '1.25rem', // Adjust this value to change the icon size
        },
    }

    return (
        <div className="project-body">
            <NewProjectDetails datePickerStyles={datePickerStyles} />
            <TeamDetails onAddTeamMember={() => setIsModalOpen(true)} />
            <KanbanDetails />
        </div>
    )
}

export default ProjectBody
