import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useProjectContext } from '../../context/ProjectContext';
import styles from './CreateProjectModal.module.css';

const CreateProjectModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { updateCurrentProject, deleteCurrentProject, currentProject } = useProjectContext();
    const [formData, setFormData] = useState({
        projectName: currentProject?.projectName || 'New Project',
        startDate: currentProject?.startDate || dayjs().format('DD-MM-YYYY'),
        targetDate: currentProject?.targetDate || dayjs().add(1, 'month').format('DD-MM-YYYY'),
        secondaryAdminsAllowed: currentProject?.secondaryAdminsAllowed || false,
        eisenhowerEnabled: currentProject?.eisenhowerEnabled || false
    });
    const [errors, setErrors] = useState({});
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (currentProject) {
                setFormData({
                    projectName: currentProject.projectName,
                    startDate: dayjs(currentProject.startDate).format('YYYY-MM-DD'),
                    targetDate: dayjs(currentProject.targetDate).format('YYYY-MM-DD'),
                    secondaryAdminsAllowed: currentProject.secondaryAdminsAllowed,
                    eisenhowerEnabled: currentProject.eisenhowerEnabled
                });
            } else {
                // Reset to defaults if no current project
                setFormData({
                    projectName: "New Project",
                    startDate: dayjs().format('YYYY-MM-DD'),
                    targetDate: dayjs().add(1, 'month').format('YYYY-MM-DD'),
                    secondaryAdminsAllowed: false,
                    eisenhowerEnabled: false
                });
            }
            setErrors({});
            setShowConfirmation(false);
        }
    }, [isOpen, currentProject]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.projectName || !formData.projectName.trim()) {
            newErrors.projectName = 'Project name is required';
        }

        // Check for empty start date
        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required';
        }

        // Check for empty target date
        if (!formData.targetDate) {
            newErrors.targetDate = 'Target date is required';
        }

        // If both dates are filled, check if target date is after start date
        if (formData.startDate && formData.targetDate) {
            const start = new Date(formData.startDate);
            const target = new Date(formData.targetDate);
            if (target < start) {
                newErrors.targetDate = 'Target date must be after start date';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        if (validateForm()) {
            setShowConfirmation(true);
        }
    };

    const handleConfirmSave = async () => {
        try {
            await updateCurrentProject(formData);
            onClose();
            navigate('/dashboard');
        } catch (error) {
            console.error('Error saving project:', error);
            setErrors(prev => ({ ...prev, submit: 'Failed to save project' }));
        }
    };

    const handleClose = async () => {
        if (currentProject) {
            await deleteCurrentProject();
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles['modal-overlay']} onClick={handleClose}>
            <div className={styles['modal-container']} onClick={e => e.stopPropagation()}>

                {showConfirmation ? (
                    <div className={styles['confirmation-content']}>
                        <h2>Confirm Project Creation</h2>
                        <p>Are you sure you want to create this project with these details?</p>
                        <div className={styles['confirmation-details']}>
                            <p>Project Name: {formData.projectName}</p>
                            <p>Start Date: {dayjs(formData.startDate).format('DD/MM/YYYY')}</p>
                            <p>Target Date: {dayjs(formData.targetDate).format('DD/MM/YYYY')}</p>
                            <p>Secondary Admins: {formData.secondaryAdminsAllowed ? 'Yes' : 'No'}</p>
                            <p>Eisenhower Matrix: {formData.eisenhowerEnabled ? 'Yes' : 'No'}</p>
                        </div>
                        <div className={styles['button-group']}>
                            <div
                                className={styles['cancel-button']}
                                onClick={() => setShowConfirmation(false)}
                            >
                                Back to Edit
                            </div>
                            <div
                                className={styles['save-button']}
                                onClick={handleConfirmSave}
                            >
                                Create Project
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={styles['modal-title']}>Create New Project</div>

                        <div className={styles['form-group']}>
                            <label className={styles['form-label']}>
                                Project Name
                                <span className={styles['default-value']}>{`default: "New Project"`}</span>
                            </label>
                            <input
                                type="text"
                                name="projectName"
                                value={formData.projectName}
                                onChange={handleInputChange}
                                className={styles['form-input']}
                            />
                        </div>

                        <div className={styles['form-group']}>
                            <label className={styles['form-label']}>
                                Start Date
                                <span className={styles['default-value']}>(default: today)</span>
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                className={styles['form-input']}
                                placeholder="Start Date"
                            />
                        </div>

                        <div className={styles['form-group']}>
                            <label className={styles['form-label']}>
                                Target Date
                                <span className={styles['default-value']}>(default: 1 month from today)</span>
                            </label>
                            <input
                                type="date"
                                name="targetDate"
                                value={formData.targetDate}
                                onChange={handleInputChange}
                                className={styles['form-input']}
                                placeholder="Target Date"
                            />
                        </div>

                        <div className={styles['checkbox-group']}>
                            <input
                                type="checkbox"
                                name="secondaryAdminsAllowed"
                                checked={formData.secondaryAdminsAllowed}
                                onChange={handleInputChange}
                            />
                            <label>Secondary Admins Allowed</label>
                        </div>

                        <div className={styles['checkbox-group']}>
                            <input
                                type="checkbox"
                                name="eisenhowerEnabled"
                                checked={formData.eisenhowerEnabled}
                                onChange={handleInputChange}
                            />
                            <label>Eisenhower Matrix</label>
                        </div>

                        <div className={styles['button-group']}>
                            <div
                                className={styles['cancel-button']}
                                onClick={handleClose}
                            >
                                Cancel
                            </div>
                            <div
                                className={styles['save-button']}
                                onClick={handleSave}
                            >
                                Review Details
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

CreateProjectModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default CreateProjectModal
