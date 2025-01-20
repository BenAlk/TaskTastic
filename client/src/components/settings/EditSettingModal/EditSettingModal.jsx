import PropTypes from 'prop-types'
import { useState } from 'react'
import Modal from '../../common/Modal/Modal'
import styles from './EditSettingModal.module.css'

const EditSettingModal = ({
    isOpen,
    onClose,
    settingType,
    currentValue,
    onSave
}) => {
    const [value, setValue] = useState(currentValue)
    const [currentPassword, setCurrentPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [error, setError] = useState('')

    const validateInput = () => {
        setError('')

        if (settingType !== 'password') {
            if (!value.trim()) {
                setError('This field cannot be empty')
                return false
            }

            if (settingType === 'email') {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                if (!emailRegex.test(value)) {
                    setError('Please enter a valid email address')
                    return false
                }
            }
            return true
        }

        if (!currentPassword) {
            setError('Please enter your current password')
            return false
        }

        if (value.length < 8) {
            setError('New password must be at least 8 characters long')
            return false
        }

        if (value !== confirmPassword) {
            setError('New passwords do not match')
            return false
        }

        if (currentPassword === value) {
            setError('New password must be different from current password')
            return false
        }

        return true
    }

    const handleSave = () => {
        if (validateInput()) {
            setShowConfirmation(true)
        }
    }

    const handleClose = () => {
        setValue(currentValue)
        setCurrentPassword('')
        setConfirmPassword('')
        setError('')
        setShowConfirmation(false)
        onClose()
    }

    const handleConfirm = async () => {
        try {
            const dataToSave = settingType === 'password'
                ? { currentPassword, newPassword: value }
                : value

            await onSave(dataToSave)
            handleClose()
        } catch (error) {
            setError(error.message)
            setShowConfirmation(false)
        }
    }


    const renderPasswordForm = () => (
        <>
            <div className={styles['form-group']}>
                <label className={styles['form-label']}>Current Password </label>
                <span>WARNING! If you enter this incorrectly, you will be logged out.</span>
                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className={`${styles['form-input']} ${error ? styles['error'] : ''}`}
                />
            </div>
            <div className={styles['form-group']}>
                <label className={styles['form-label']}>New Password</label>
                <input
                    type="password"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className={`${styles['form-input']} ${error ? styles['error'] : ''}`}
                />
            </div>
            <div className={styles['form-group']}>
                <label className={styles['form-label']}>Confirm New Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`${styles['form-input']} ${error ? styles['error'] : ''}`}
                />
            </div>
        </>
    )

    const renderRegularForm = () => (
        <div className={styles['form-group']}>
            <label className={styles['form-label']}>
                New {settingType}
            </label>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={`${styles['form-input']} ${error ? styles['error'] : ''}`}
            />
        </div>
    )

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={showConfirmation ? 'Confirm Changes' : `Edit ${settingType?.charAt(0).toUpperCase()}${settingType?.slice(1)}`}
        >
            {showConfirmation ? (
                <div className={styles['confirmation-content']}>
                    <p>Are you sure you want to change your {settingType}?</p>
                    <div className={styles['button-group']}>
                        <div
                            className={styles['cancel-button']}
                            onClick={() => setShowConfirmation(false)}
                        >
                            Back to Edit
                        </div>
                        <div
                            className={styles['save-button']}
                            onClick={handleConfirm}
                        >
                            Confirm Changes
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles['modal-content']}>
                    {settingType === 'password' ? renderPasswordForm() : renderRegularForm()}
                    {error && <span className={styles['error-message']}>{error}</span>}
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
                            Review Changes
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    )
}

EditSettingModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    settingType: PropTypes.oneOf(['firstName', 'lastName', 'email', 'password']).isRequired,
    currentValue: PropTypes.string,
    onSave: PropTypes.func.isRequired
}

export default EditSettingModal
