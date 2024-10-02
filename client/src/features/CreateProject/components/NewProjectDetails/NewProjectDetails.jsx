import { useContext, useCallback } from 'react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import ChoiceSelector from '../ChoiceSelector/ChoiceSelector'
import { ProjectContext } from '../../ProjectContext'
import PropTypes from 'prop-types'
import "./styles/NewProjectDetails.css"

const NewProjectDetails = ({ datePickerStyles }) => {
    const { projectData, handleDateChange, handleOptionsChange } = useContext(ProjectContext)

    const handleOptionChange = useCallback((id) => (isChecked) => {
        handleOptionsChange({ [id]: isChecked })
    }, [handleOptionsChange])

    return (
        <div className="new-project-details">
            <div className="new-project-details-title">
                <h3>Project Details</h3>
            </div>
            <div className="new-projects-details-container">
                <div className="new-project-dates-container">
                    <div className="new-project-start-date">
                        <label htmlFor="newProjectStartDate" className="new-project-start-date-label">Start Date</label>
                        <div className="new-project-start-date-picker" id="newProjectStartDate">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    value={projectData.startDate}
                                    onChange={(date) => handleDateChange('startDate', date)}
                                    format="DD/MM/YYYY"
                                    sx={datePickerStyles}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    <div className="new-project-target-date">
                        <label htmlFor="newProjectTargetDate" className="new-project-target-date-label">Target Date</label>
                        <div className="new-project-target-date-picker" id="newProjectTargetDate">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    value={projectData.targetDate}
                                    onChange={(date) => handleDateChange('targetDate', date)}
                                    format="DD/MM/YYYY"
                                    sx={datePickerStyles}
                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                </div>
                <div className="new-project-choice-selectors">
                    {Object.entries(projectData.options).map(([key, value]) => (
                        <ChoiceSelector
                            key={key}
                            active={true}
                            id={key}
                            checked={value}
                            onChange={handleOptionChange(key)}
                            className={key}
                        >
                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                        </ChoiceSelector>
                    ))}
                </div>
            </div>
        </div>
    )
}

NewProjectDetails.propTypes = {
    datePickerStyles: PropTypes.object
}

export default NewProjectDetails
