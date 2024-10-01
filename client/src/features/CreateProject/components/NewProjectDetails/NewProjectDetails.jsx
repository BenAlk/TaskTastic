import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import ChoiceSelector from '../ChoiceSelector/ChoiceSelector'
import PropTypes from 'prop-types'
import "./styles/NewProjectDetails.css"

const NewProjectDetails = ({datePickerStyles, projectData, handleStartDateChange, handleTargetDateChange}) => {
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
                                                onChange={handleStartDateChange}
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
                                                onChange={handleTargetDateChange}
                                                format="DD/MM/YYYY"
                                                sx={datePickerStyles}
                                            />
                                        </LocalizationProvider>
                                    </div>
                                </div>
                            </div>
                            <div className="new-project-choice-selectors">
                                <ChoiceSelector active={true} id="enableEisenhower" initialChecked={false} onChange={(id, isChecked) => console.log(`${id} ${isChecked}`)} className="eisenhower">Enable Eisenhower</ChoiceSelector>
                                <ChoiceSelector active={true} id="enableAdmins" initialChecked={false} onChange={(id, isChecked) => console.log(`${id} ${isChecked}`)} className="team">Enable Admins</ChoiceSelector>
                                <ChoiceSelector active={false} id="tbd-1" initialChecked={false} onChange={(id, isChecked) => console.log(`${id} ${isChecked}`)} className="tbd">TBD1</ChoiceSelector>
                                <ChoiceSelector active={false} id="tbd-2" initialChecked={false} onChange={(id, isChecked) => console.log(`${id} ${isChecked}`)} className="tbd">TBD2</ChoiceSelector>
                                <ChoiceSelector active={false} id="tbd-3" initialChecked={false} onChange={(id, isChecked) => console.log(`${id} ${isChecked}`)} className="tbd">TBD3</ChoiceSelector>
                                <ChoiceSelector active={false} id="tbd-4" initialChecked={false} onChange={(id, isChecked) => console.log(`${id} ${isChecked}`)} className="tbd">TBD4</ChoiceSelector>
                            </div>
                        </div>
                    </div>
    )
}

NewProjectDetails.propTypes = {
    datePickerStyles: PropTypes.object,
    projectData: PropTypes.object,
    handleStartDateChange: PropTypes.func,
    handleTargetDateChange: PropTypes.func
}

export default NewProjectDetails
