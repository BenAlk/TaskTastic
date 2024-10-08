import { useContext, useEffect, useCallback } from 'react'
import { ProjectContext } from '../../ProjectContext'
import { LayoutContext } from "../../../../pages/Layout/index"
import "./styles/ProjectHeader.css"
import PropTypes from "prop-types"
import dayjs from 'dayjs'

const ProjectHeader = ({handleSubmit}) => {
    const { projectData,  handleInputChange } = useContext(ProjectContext)
    const { errors, setErrors } = useContext(LayoutContext)

    const isValidDate = useCallback((date) => {
        return dayjs(date).isValid();
    }, [])

    const validateField = useCallback((name, value) => {
        let error = null;
        const currentDate = dayjs().startOf('day');
        switch (name) {
            case 'name':
                error = !value.trim() ? 'Please enter a name for the project' : null;
                break;
                case 'startDate':
                    if (!isValidDate(value)) {
                        error = 'Please select a valid start date';
                    } else if (dayjs(value).isBefore(currentDate)) {
                        error = 'Start date cannot be in the past';
                    }
                    break;
            case 'targetDate':
                if (!isValidDate(value)) {
                    error = 'Please select a valid target date';
                } else if (dayjs(value).isBefore(dayjs(projectData.startDate))) {
                    error = 'Target date must be after start date';
                }
                break;
            case 'kanban':
                error = value.length < 2 ? 'Please add at least 2 columns to the kanban board' : null;
                break;
            default:
                break;
        }
        return error;
    }, [isValidDate, projectData.startDate])


    useEffect(() => {
        // Validate dates whenever they change
        const startDateError = validateField('startDate', projectData.startDate);
        const targetDateError = validateField('targetDate', projectData.targetDate);

        setErrors(prev => ({
            ...prev,
            startDate: startDateError,
            targetDate: targetDateError
        }));
    }, [projectData.startDate, projectData.targetDate, setErrors, validateField]);

    const handleInputChangeWithErrorCheck = (e) => {
        const { name, value } = e.target;
        handleInputChange(e);

        const error = validateField(name, value);
        setErrors(prev => {
            if (error) {
                return { ...prev, [name]: error };
            } else {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            }
        });
    }

    const onClickSubmit = (e) => {
        const allFields = ['name', 'startDate', 'targetDate', 'kanban'];
        const newErrors = {};
        allFields.forEach(field => {
            const error = validateField(field, projectData[field]);
            if (error) newErrors[field] = error;
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            handleSubmit(e);
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
                    name="name"
                    value={projectData.name}
                    onChange={handleInputChangeWithErrorCheck}
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
