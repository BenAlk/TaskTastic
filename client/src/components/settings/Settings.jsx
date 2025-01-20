import { useState, useEffect } from 'react'
import styles from './Settings.module.css'
import { useAuth } from '../../context/AuthContext'
import useUserService from '../../services/usersService'
import EditSettingModal from './EditSettingModal/EditSettingModal'

const Settings = () => {
    const { currentUser, loading } = useAuth()
    const userService = useUserService()
    const [userData, setUserData] = useState(null)
    const [editModal, setEditModal] = useState({
        isOpen: false,
        settingType: null,
        currentValue: ''
    })

    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser?._id) {
                try {
                    const latestUserData = await userService.fetchUserDetails(currentUser._id)
                    setUserData(latestUserData)
                } catch (error) {
                    console.error('Failed to fetch user details:', error)
                    setUserData(currentUser)
                }
            }
        }

        fetchUserData()
    }, [currentUser])

    if (loading) {
        return (
            <div className={styles['settings-container']}>
                <div className={styles['settings-header-container']}>
                    <h2>Settings</h2>
                </div>
                <div className={styles['settings-content-container']}>
                    <div className={styles['settings-section']}>
                        <div className={styles['loading-message']}>
                            Loading user information...
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const handleEditClick = (settingType, currentValue) => {
        setEditModal({
            isOpen: true,
            settingType,
            currentValue: settingType === 'password' ? '' : currentValue
        })
    }

    const handleSaveSettings = async (newValue) => {
        try {
            if (editModal.settingType === 'password') {
                // For password updates, newValue will be an object
                const { currentPassword, newPassword } = newValue;
                await userService.updatePassword(
                    currentUser._id,
                    currentPassword,
                    newPassword
                )
            } else {
                const updates = {
                    [editModal.settingType]: newValue
                }
                const updatedUser = await userService.updateProfile(
                    currentUser._id,
                    updates
                )
                setUserData(updatedUser)
            }
            return true
        } catch (error) {
            throw new Error(error.message || 'Failed to update profile');
        }
    }

    const InfoBlock = ({ label, value, onEditClick }) => (
        <div className={styles['info-block']}>
            <div className={styles['info-content']}>
                <span className={styles['info-label']}>{label}</span>
                <span className={styles['info-value']}>
                    {value || 'Not set'}
                </span>
            </div>
            <div
                className={styles['edit-button']}
                onClick={onEditClick}
                role="button"
                tabIndex={0}
            >
                Edit
            </div>
        </div>
    )

    const displayData = userData || currentUser || {}

    return (
        <div className={styles['settings-container']}>
            <div className={styles['settings-header-container']}>
                <h2>Settings</h2>
            </div>
            <div className={styles['settings-content-container']}>
                <div className={styles['settings-section']}>
                    <h3>User Details</h3>
                    <div className={styles['info-blocks-container']}>
                        <InfoBlock
                            label="First Name"
                            value={displayData.firstName}
                            onEditClick={() => handleEditClick('firstName', displayData.firstName)}
                        />
                        <InfoBlock
                            label="Last Name"
                            value={displayData.lastName}
                            onEditClick={() => handleEditClick('lastName', displayData.lastName)}
                        />
                        <InfoBlock
                            label="Email"
                            value={displayData.email}
                            onEditClick={() => handleEditClick('email', displayData.email)}
                        />

                        <div className={styles['password-block']}>
                            <div className={styles['info-content']}>
                                <span className={styles['info-label']}>Password</span>
                                <span className={styles['info-value']}>••••••••</span>
                            </div>
                            <div
                                className={styles['edit-button']}
                                onClick={() => handleEditClick('password', '')}
                                role="button"
                                tabIndex={0}
                            >
                                Change Password
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles['settings-section']}>
                    <h3>Preferences</h3>
                    <div className={styles['preferences-list']}>
                        <div className={styles['preference-item']}>
                            <span>Theme</span>
                            <span>Coming soon</span>
                        </div>
                        <div className={styles['preference-item']}>
                            <span>Language</span>
                            <span>Coming soon</span>
                        </div>
                        <div className={styles['preference-item']}>
                            <span>Timezone</span>
                            <span>Coming soon</span>
                        </div>
                    </div>
                </div>
            </div>

            {editModal.settingType && (
                <EditSettingModal
                    isOpen={editModal.isOpen}
                    onClose={() => setEditModal({ isOpen: false, settingType: null, currentValue: '' })}
                    settingType={editModal.settingType}
                    currentValue={editModal.currentValue}
                    onSave={handleSaveSettings}
                />
            )}
        </div>
    )
}

export default Settings
