import PropTypes from 'prop-types'
import { useState, useEffect, useMemo } from 'react'
import dayjs from 'dayjs'
import { useProjectContext } from '../../../../../context/ProjectContext'
import { useAuth } from '../../../../../context/AuthContext'
import { useUserContext } from '../../../../../context/UserContext'
import styles from './EditProjectModal.module.css'
import Modal from "../../../../common/Modal/Modal"

const EditProjectModal = ({ isOpen, onClose }) => {
    const { currentUser } = useAuth()
    const { updateCurrentProject, currentProject, transferOwnership } = useProjectContext()
    const { getMultipleUsers, userCache } = useUserContext()

    const [formData, setFormData] = useState({
        projectName: '',
        startDate: '',
        targetDate: '',
        secondaryAdminsAllowed: false,
        eisenhowerEnabled: false
    })

    const [loadingUsers, setLoadingUsers] = useState(false)
    const [errors, setErrors] = useState({})
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [showOwnershipConfirmation, setShowOwnershipConfirmation] = useState(false)
    const [selectedNewOwner, setSelectedNewOwner] = useState('')
    const [transferring, setTransferring] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        if (isOpen && currentProject) {
            setFormData({
                projectName: currentProject.projectName,
                startDate: dayjs(currentProject.startDate).format('YYYY-MM-DD'),
                targetDate: dayjs(currentProject.targetDate).format('YYYY-MM-DD'),
                secondaryAdminsAllowed: currentProject.secondaryAdminsAllowed,
                eisenhowerEnabled: currentProject.eisenhowerEnabled
            })
            setErrors({})
            setShowConfirmation(false)
            setShowOwnershipConfirmation(false)
            setSuccessMessage('')
            setSelectedNewOwner('')
        }
    }, [isOpen, currentProject])

    const eligibleAdminIds = useMemo(() => {
        if (!currentProject?.team) return []
        return currentProject.team
            .filter(member =>
                member.role === 'admin' &&
                member.user !== currentProject.projectOwner
            )
            .map(member => member.user)
    }, [currentProject])

    useEffect(() => {
        const fetchAdminUsers = async () => {
            if (eligibleAdminIds.length === 0) return

            setLoadingUsers(true)
            try {
                await getMultipleUsers(eligibleAdminIds)
            } catch (error) {
                console.error('Error fetching admin users:', error)
                setErrors(prev => ({ ...prev, users: 'Failed to load user details' }))
            } finally {
                setLoadingUsers(false)
            }
        };

        if (isOpen) {
            fetchAdminUsers()
        }
    }, [eligibleAdminIds, getMultipleUsers, isOpen])

    const validateForm = () => {
        const newErrors = {}

        if (!formData.projectName?.trim()) {
            newErrors.projectName = 'Project name is required'
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required'
        }

        if (!formData.targetDate) {
            newErrors.targetDate = 'Target date is required'
        }

        if (formData.startDate && formData.targetDate) {
            const start = new Date(formData.startDate)
            const target = new Date(formData.targetDate)
            if (target < start) {
                newErrors.targetDate = 'Target date must be after start date'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSave = () => {
        if (validateForm()) {
            setShowConfirmation(true)
        }
    }

    const handleConfirmSave = async () => {
        try {
            await updateCurrentProject(formData)
            setSuccessMessage('Project updated successfully!')
            setTimeout(() => {
                onClose()
            }, 1500)
        } catch (error) {
            console.error('Error saving project:', error)
            setErrors(prev => ({ ...prev, submit: 'Failed to update project' }))
        }
    }

    const handleTransferOwnership = async () => {
        if (!selectedNewOwner) {
            setErrors(prev => ({ ...prev, ownership: 'Please select a new owner' }))
            return
        }

        setTransferring(true)
        try {
            await transferOwnership(selectedNewOwner);
            setSuccessMessage('Ownership transferred successfully!')
            setTimeout(() => {
                onClose()
            }, 1500)
        } catch (error) {
            console.error('Error transferring ownership:', error)
            setErrors(prev => ({ ...prev, ownership: 'Failed to transfer ownership' }))
        } finally {
            setTransferring(false)
        }
    }

    if (!isOpen || !currentProject) return null

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={showOwnershipConfirmation
                ? "Confirm Ownership Transfer"
                : showConfirmation
                    ? "Confirm Project Update"
                    : "Edit Project"}
        >
            {successMessage ? (
                <div className={styles['success-message']}>
                    {successMessage}
                </div>
            ) : showOwnershipConfirmation ? (
                <div className={styles['confirmation-content']}>
                    <h3 className={styles['confirmation-title']}>Transfer Project Ownership</h3>
                    <div className={styles['confirmation-details']}>
                        <p className={styles['warning-text']}>
                            Are you sure you want to transfer ownership of this project?
                            This action cannot be undone.
                        </p>
                        <p>Selected new owner: {
                            userCache[selectedNewOwner]?.email || 'Unknown User'
                        }</p>
                    </div>
                    <div className={styles['button-group']}>
                        <button
                            className={styles['cancel-button']}
                            onClick={() => setShowOwnershipConfirmation(false)}
                            disabled={transferring}
                        >
                            Cancel
                        </button>
                        <button
                            className={`${styles['save-button']} ${styles['warning']}`}
                            onClick={handleTransferOwnership}
                            disabled={transferring}
                        >
                            {transferring ? 'Transferring...' : 'Confirm Transfer'}
                        </button>
                    </div>
                </div>
            ) : showConfirmation ? (
                <div className={styles['confirmation-content']}>
                    <h3 className={styles['confirmation-title']}>Update Project</h3>
                    <div className={styles['confirmation-details']}>
                        <p>Project Name: {formData.projectName}</p>
                        <p>Start Date: {dayjs(formData.startDate).format('DD/MM/YYYY')}</p>
                        <p>Target Date: {dayjs(formData.targetDate).format('DD/MM/YYYY')}</p>
                        <p>Secondary Admins: {formData.secondaryAdminsAllowed ? 'Yes' : 'No'}</p>
                        <p>Eisenhower Matrix: {formData.eisenhowerEnabled ? 'Yes' : 'No'}</p>
                    </div>
                    <div className={styles['button-group']}>
                        <button
                            className={styles['cancel-button']}
                            onClick={() => setShowConfirmation(false)}
                        >
                            Back to Edit
                        </button>
                        <button
                            className={styles['save-button']}
                            onClick={handleConfirmSave}
                        >
                            Update Project
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div className={styles['form-group']}>
                        <label className={styles['form-label']}>Project Name</label>
                        <input
                            type="text"
                            name="projectName"
                            value={formData.projectName}
                            onChange={handleInputChange}
                            className={`${styles['form-input']} ${errors.projectName ? styles['error'] : ''}`}
                        />
                        {errors.projectName && (
                            <span className={styles['error-message']}>{errors.projectName}</span>
                        )}
                    </div>

                    <div className={styles['form-group']}>
                        <label className={styles['form-label']}>Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            className={`${styles['form-input']} ${errors.startDate ? styles['error'] : ''}`}
                        />
                        {errors.startDate && (
                            <span className={styles['error-message']}>{errors.startDate}</span>
                        )}
                    </div>

                    <div className={styles['form-group']}>
                        <label className={styles['form-label']}>Target Date</label>
                        <input
                            type="date"
                            name="targetDate"
                            value={formData.targetDate}
                            onChange={handleInputChange}
                            className={`${styles['form-input']} ${errors.targetDate ? styles['error'] : ''}`}
                        />
                        {errors.targetDate && (
                            <span className={styles['error-message']}>{errors.targetDate}</span>
                        )}
                    </div>

                    <div className={styles['checkbox-group']}>
                        <input
                            type="checkbox"
                            name="secondaryAdminsAllowed"
                            checked={formData.secondaryAdminsAllowed}
                            onChange={handleInputChange}
                            id="secondaryAdminsAllowed"
                        />
                        <label htmlFor="secondaryAdminsAllowed">Secondary Admins Allowed</label>
                    </div>

                    <div className={styles['checkbox-group']}>
                        <input
                            type="checkbox"
                            name="eisenhowerEnabled"
                            checked={formData.eisenhowerEnabled}
                            onChange={handleInputChange}
                            id="eisenhowerEnabled"
                        />
                        <label htmlFor="eisenhowerEnabled">Eisenhower Matrix</label>
                    </div>

                    {currentProject.projectOwner === currentUser?._id && (
                        <div className={styles['ownership-section']}>
                            <h3 className={styles['section-title']}>Transfer Project Ownership</h3>
                            <p className={styles['section-description']}>
                                Transfer ownership to another admin. This action cannot be undone.
                            </p>

                            {loadingUsers ? (
                                <div className={styles['loading-message']}>
                                    Loading admin users...
                                </div>
                            ) : eligibleAdminIds.length > 0 ? (
                                <>
                                    <select
                                        className={styles['owner-select']}
                                        value={selectedNewOwner}
                                        onChange={(e) => setSelectedNewOwner(e.target.value)}
                                        disabled={loadingUsers}
                                    >
                                        <option value="">Select new owner</option>
                                        {eligibleAdminIds.map(userId => {
                                            const user = userCache[userId];
                                            if (!user) return null;

                                            const displayName = user.firstName && user.lastName
                                                ? `${user.firstName} ${user.lastName}`
                                                : user.email;

                                            return (
                                                <option key={userId} value={userId}>
                                                    {displayName}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <button
                                        className={styles['transfer-button']}
                                        onClick={() => setShowOwnershipConfirmation(true)}
                                        disabled={!selectedNewOwner}
                                    >
                                        Transfer Ownership
                                    </button>
                                </>
                            ) : (
                                <p className={styles['no-admins-message']}>
                                    No other admins available. Add another admin to transfer ownership.
                                </p>
                            )}
                            {errors.ownership && (
                                <span className={styles['error-message']}>{errors.ownership}</span>
                            )}
                        </div>
                    )}

                    {errors.submit && (
                        <div className={styles['error-message']}>{errors.submit}</div>
                    )}

                    <div className={styles['button-group']}>
                        <button
                            className={styles['cancel-button']}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className={styles['save-button']}
                            onClick={handleSave}
                        >
                            Review Changes
                        </button>
                    </div>
                </>
            )}
        </Modal>
    )
}

EditProjectModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
}

export default EditProjectModal
