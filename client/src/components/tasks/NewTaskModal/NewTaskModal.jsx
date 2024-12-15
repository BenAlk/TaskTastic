import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { useTaskContext } from '../../../context/TaskContext';
import { useProjectContext } from '../../../context/ProjectContext';
import { useAuth } from '../../../context/AuthContext';
import styles from './NewTaskModal.module.css';
import Modal from "../../common/Modal/Modal";

const NewTaskModal = ({ isOpen, onClose }) => {
    const { currentProject } = useProjectContext();
    const { createTask } = useTaskContext();
    const { currentUser } = useAuth();

    const initialFormState = {
        title: '',
        description: '',
        assignedTo: currentUser._id,
        kanbanColumnId: currentProject?.kanbanColumns[0]?._id,
        dueDate: dayjs().add(1, 'week').format('YYYY-MM-DD'),
        isAtRisk: false,
        eisenhowerStatus: currentProject?.eisenhowerEnabled ? {
            important: false,
            urgent: false
        } : null
    };

    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setFormData(initialFormState);
            setErrors({});
            setShowConfirmation(false);
        }
    }, [isOpen]);

    const handleClose = () => {
        setFormData(initialFormState);
        setErrors({});
        setShowConfirmation(false);
        onClose();
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title || !formData.title.trim()) {
            newErrors.title = 'Task title is required';
        }

        if (!formData.dueDate) {
            newErrors.dueDate = 'Due date is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            if (name.startsWith('eisenhower.')) {
                const [, status] = name.split('.');
                setFormData(prev => ({
                    ...prev,
                    eisenhowerStatus: {
                        ...prev.eisenhowerStatus,
                        [status]: checked
                    }
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    [name]: checked
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSave = () => {
        if (validateForm()) {
            setShowConfirmation(true);
        }
    };

    const handleConfirmSave = async () => {
        try {
            const taskWithProject = {
                ...formData,
                projectId: currentProject._id,
                kanbanColumnId: currentProject.kanbanColumns[0]._id,
                risk: {
                    isAtRisk: formData.isAtRisk,
                    riskType: null,
                    riskDescription: null,
                    flaggedBy: null,
                    flaggedByUserId: null,
                    flaggedAt: null
                }
            };
            const result = await createTask(taskWithProject);

            if (result) {
                onClose();
            } else {
                setErrors(prev => ({ ...prev, submit: 'Failed to create task' }));
            }
        } catch (error) {
            console.error('Error creating task:', error);
            setErrors(prev => ({ ...prev, submit: 'Failed to create task' }));
        }
    };

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={showConfirmation ? "Confirm Task Creation" : "Create New Task"}
        >
            {showConfirmation ? (
                <div className={styles['confirmation-content']}>
                    <p>Are you sure you want to create this task with these details?</p>
                    <div className={styles['confirmation-details']}>
                        <p>Title: {formData.title}</p>
                        <p>Description: {formData.description}</p>
                        <p>Due Date: {dayjs(formData.dueDate).format('DD/MM/YYYY')}</p>
                        {currentProject?.eisenhowerEnabled && (
                            <p>Eisenhower: {formData.eisenhowerStatus.important ? 'Important' : 'Not Important'},
                                {formData.eisenhowerStatus.urgent ? 'Urgent' : 'Not Urgent'}</p>
                        )}
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
                            Create Task
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className={styles['form-group']}>
                        <label className={styles['form-label']}>Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className={`${styles['form-input']} ${errors.title ? styles['error'] : ''}`}
                        />
                        {errors.title && <span className={styles['error-message']}>{errors.title}</span>}
                    </div>

                    <div className={styles['form-group']}>
                        <label className={styles['form-label']}>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className={styles['form-input']}
                            rows={3}
                        />
                    </div>

                    <div className={styles['form-group']}>
                        <label className={styles['form-label']}>Due Date</label>
                        <input
                            type="date"
                            name="dueDate"
                            value={formData.dueDate}
                            onChange={handleInputChange}
                            className={`${styles['form-input']} ${errors.dueDate ? styles['error'] : ''}`}
                        />
                        {errors.dueDate && <span className={styles['error-message']}>{errors.dueDate}</span>}
                    </div>

                    <div className={styles['form-group']}>
                        <label className={styles['form-label']}>Assigned To</label>
                        <select
                            name="assignedTo"
                            value={formData.assignedTo}
                            onChange={handleInputChange}
                            className={styles['form-input']}
                        >
                            {currentProject?.team.map(member => (
                                <option key={member._id} value={member.user}>
                                    {member.user === currentUser._id ? 'Me' : member.user}
                                </option>
                            ))}
                        </select>
                    </div>

                    {currentProject?.eisenhowerEnabled && (
                        <>
                            <div className={styles['checkbox-group']}>
                                <input
                                    type="checkbox"
                                    name="eisenhower.important"
                                    checked={formData.eisenhowerStatus.important || false}
                                    onChange={handleInputChange}
                                />
                                <label>Important</label>
                            </div>
                            <div className={styles['checkbox-group']}>
                                <input
                                    type="checkbox"
                                    name="eisenhower.urgent"
                                    checked={formData.eisenhowerStatus.urgent || false}
                                    onChange={handleInputChange}
                                />
                                <label>Urgent</label>
                            </div>
                        </>
                    )}

                    {errors.submit && <div className={styles['error-message']}>{errors.submit}</div>}

                    <div className={styles['button-group']}>
                        <div
                            className={styles['cancel-button']}
                            onClick={onClose}
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
        </Modal>
    );
};

NewTaskModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default NewTaskModal;
