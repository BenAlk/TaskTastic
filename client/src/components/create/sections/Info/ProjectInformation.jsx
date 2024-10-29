import PropTypes from 'prop-types'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import styles from "./ProjectInformation.module.css"
const ProjectInformation = ({ formData, setFormData, errors }) => {

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleDateChange = (field) => (newValue) => {
        setFormData(prev => ({
            ...prev,
            [field]: newValue ? dayjs(newValue).format('DD-MM-YYYY') : null
        }))
    }

    return (
        <div className={styles['project-information-container']}>
            <div className={styles['project-information-header-container']}>
                <h2 className={styles['project-information-icon']}>CalenderIcon</h2>
                <h2 className={styles['project-information-title']}>Project Information</h2>
            </div>

            <div className={styles['form-container']}>
                <div className={styles['input-group']}>
                    <label htmlFor="projectName" className={styles['input-label']}>
                        Project Name
                    </label>
                    <input
                        id="projectName"
                        type="text"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleInputChange}
                        className={styles['input-field']}
                        placeholder="Enter project name"
                    />
                </div>

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <div className={styles['date-container']}>
                        <div className={styles['input-group']}>
                            <label htmlFor="startDate" className={styles['input-label']}>
                                Start Date
                            </label>
                            <DatePicker
                                value={formData.startDate ? dayjs(formData.startDate) : null}
                                onChange={handleDateChange('startDate')}
                                format="DD-MM-YYYY"
                                className={styles['date-picker']}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        fullwidth: "true",
                                        className: styles['date-picker-text-field']
                                    }
                                }}
                            />
                        </div>

                        <div className={styles['input-group']}>
                            <label className={styles['label']}>Target Date</label>
                            <DatePicker
                                value={formData.targetDate ? dayjs(formData.targetDate) : null}
                                onChange={handleDateChange('targetDate')}
                                format="DD-MM-YYYY"
                                minDate={formData.startDate ? dayjs(formData.startDate) : null}
                                className={styles['date-picker']}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        fullwidth: "true",
                                        className: styles['date-picker-text-field']
                                    }
                                }}
                            />
                        </div>
                    </div>
                </LocalizationProvider>

                <div className={styles['checkbox-container']}>
                    <div className={styles['checkbox-group']}>
                        <input
                            id="secondaryAdminsAllowed"
                            type="checkbox"
                            name="secondaryAdminsAllowed"
                            checked={formData.secondaryAdminsAllowed}
                            onChange={handleInputChange}
                            className={styles['checkbox']}
                        />
                        <label
                            htmlFor="secondaryAdminsAllowed"
                            className={styles['checkbox-label']}
                        >
                            Allow Secondary Admins
                        </label>
                    </div>

                    <div className={styles['checkbox-group']}>
                        <input
                            id="eisenhowerEnabled"
                            type="checkbox"
                            name="eisenhowerEnabled"
                            checked={formData.eisenhowerEnabled}
                            onChange={handleInputChange}
                            className={styles['checkbox']}
                        />
                        <label
                            htmlFor="eisenhowerEnabled"
                            className={styles['checkbox-label']}
                        >
                            Enable Eisenhower Matrix
                        </label>
                    </div>
                </div>
            </div>
        </div>
    )
}

ProjectInformation.propTypes = {
    formData: PropTypes.shape({
        projectName: PropTypes.string.isRequired,
        startDate: PropTypes.string,
        targetDate: PropTypes.string,
        secondaryAdminsAllowed: PropTypes.bool.isRequired,
        eisenhowerEnabled: PropTypes.bool.isRequired,
    }).isRequired,
    setFormData: PropTypes.func.isRequired,
    errors: PropTypes.shape({
        projectName: PropTypes.string,
        startDate: PropTypes.string,
        targetDate: PropTypes.string,
    })
}

export default ProjectInformation
