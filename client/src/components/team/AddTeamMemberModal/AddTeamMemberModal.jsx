import PropTypes from 'prop-types'
import { useState, useEffect, useCallback } from 'react'
import styles from './AddTeamMemberModal.module.css'
import Modal from '../../common/Modal/Modal'
import { useProjectContext } from '../../../context/ProjectContext'
import { useAuth } from '../../../context/AuthContext'

const AddTeamMemberModal = ({ isOpen, onClose }) => {
    const [searchEmail, setSearchEmail] = useState('')
    const [selectedUser, setSelectedUser] = useState(null)
    const [role, setRole] = useState('member')
    const [searchResults, setSearchResults] = useState([])
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)

    const { addTeamMember, currentProject } = useProjectContext()
    const { api } = useAuth()

    const canHaveAdmins = currentProject?.secondaryAdminsAllowed ?? false

    useEffect(() => {
        if (!isOpen) {
            setSearchEmail('')
            setSelectedUser(null)
            setRole('member')
            setSearchResults([])
            setErrors({})
            setShowConfirmation(false)
        }
    }, [isOpen])

    useEffect(() => {
        if (!canHaveAdmins) {
            setRole('member')
        }
    }, [canHaveAdmins, role])

    const debounce = (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => func(...args), wait);
        };
    };

    const handleSearch = useCallback(
        debounce(async (email) => {
            if (email.length < 3) return

            setIsLoading(true)
            try {
                const response = await api.get(`/users?email=${encodeURIComponent(email)}`)
                const filteredResults = response.data.filter(user =>
                    !currentProject?.team.some(member => member.user === user._id)
                );

                setSearchResults(filteredResults)
                console.log(filteredResults)
                setErrors({})
            } catch (error) {
                console.error('Search error:', error)
                setErrors({ search: 'Error searching for users' })
                setSearchResults([])
            } finally {
                setIsLoading(false)
            }
        }, 300),
        [api, currentProject?.team]
    );

    const handleInputChange = (e) => {
        const email = e.target.value
        setSearchEmail(email)
        if (email.length >= 3) {
            handleSearch(email)
        } else {
            setSearchResults([])
        }
    };

    const handleAddMember = async () => {
        if (!selectedUser) {
            setErrors({ submit: 'Please select a user' })
            return
        }

        try {
            await addTeamMember(selectedUser._id, role)
            onClose();
        } catch (error) {
            setErrors({ submit: 'Failed to add team member' })
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Add Team Member"
            width="600px"
        >
            <div className={styles['modal-content']}>
                {showConfirmation ? (
                    <div className={styles['confirmation-content']}>
                        <p>Are you sure you want to add this team member?</p>
                        <div className={styles['confirmation-details']}>
                            <p>Name: {selectedUser?.firstName} {selectedUser?.lastName}</p>
                            <p>Email: {selectedUser?.email}</p>
                            <p>Role: {role}</p>
                        </div>
                        <div className={styles['button-group']}>
                            <div
                                className={styles['cancel-button']}
                                onClick={() => setShowConfirmation(false)}
                            >
                                Back
                            </div>
                            <div
                                className={styles['save-button']}
                                onClick={handleAddMember}
                            >
                                Confirm
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className={styles['form-group']}>
                            <label className={styles['form-label']}>Search by Email</label>
                            <input
                                type="email"
                                value={searchEmail}
                                onChange={handleInputChange}
                                className={styles['form-input']}
                                placeholder="Enter email address..."
                            />
                            {isLoading && <div className={styles['loading']}>Searching...</div>}
                            {errors.search && (
                                <div className={styles['error-message']}>{errors.search}</div>
                            )}
                        </div>

                        {searchResults.length > 0 && (
                            <div className={styles['search-results']}>
                                {searchResults.map(user => (
                                    <div
                                        key={user._id}
                                        className={`${styles['search-result-item']}
                                            ${selectedUser?._id === user._id ? styles['selected'] : ''}`}
                                        onClick={() => setSelectedUser(user)}
                                    >
                                        <div>{user.firstName} {user.lastName}</div>
                                        <div className={styles['email']}>{user.email}</div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedUser && (
                            <div className={styles['form-group']}>
                                <label className={styles['form-label']}>Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className={styles['form-input']}
                                >
                                    <option value="member">Member</option>
                                    {canHaveAdmins && (<option value="admin">Admin</option>
                                    )}
                                </select>
                            </div>
                        )}

                        {errors.submit && (
                            <div className={styles['error-message']}>{errors.submit}</div>
                        )}

                        <div className={styles['button-group']}>
                            <div
                                className={styles['cancel-button']}
                                onClick={onClose}
                            >
                                Cancel
                            </div>
                            <div
                                className={styles['save-button']}
                                onClick={() => {
                                    if (selectedUser) {
                                        setShowConfirmation(true);
                                    } else {
                                        setErrors({ submit: 'Please select a user' });
                                    }
                                }}
                            >
                                Review Details
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
};

AddTeamMemberModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};

export default AddTeamMemberModal
