import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useUserContext } from '../../../context/UserContext'
import Modal from '../../common/Modal/Modal'
import styles from './NewMessageModal.module.css'

const NewMessageModal = ({ isOpen, onClose, projectTeam, onSelectUser, currentUserId }) => {
    const [teamMembers, setTeamMembers] = useState([])
    const [loading, setLoading] = useState(true)
    const { getMultipleUsers } = useUserContext()

    useEffect(() => {
        const fetchTeamMembers = async () => {
            if (!projectTeam?.length) return

            setLoading(true)
            try {
                const teamUserIds = projectTeam.map(member => member.user)
                const users = await getMultipleUsers(teamUserIds)
                setTeamMembers(users.filter(user => user._id !== currentUserId))
            } catch (error) {
                console.error('Failed to fetch team members:', error)
            } finally {
                setLoading(false)
            }
        };

        if (isOpen) {
            fetchTeamMembers()
        }
    }, [isOpen, projectTeam, currentUserId, getMultipleUsers])

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="New Message"
            width="450px"
        >
            <div className={styles['user-list']}>
                {loading ? (
                    <div className={styles['loading-message']}>Loading team members...</div>
                ) : teamMembers.length > 0 ? (
                    teamMembers.map((member) => (
                        <div
                            key={member._id}
                            className={styles['user-item']}
                            onClick={() => {
                                onSelectUser(member)
                                onClose()
                            }}
                        >
                            <div className={styles['user-info']}>
                                <span className={styles['user-name']}>
                                    {member.firstName} {member.lastName}
                                </span>
                                <span className={styles['user-email']}>
                                    {member.email}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className={styles['no-results']}>
                        No team members available
                    </div>
                )}
            </div>

            <div className={styles['button-group']}>
                <div
                    className={styles['cancel-button']}
                    onClick={onClose}
                >
                    Cancel
                </div>
            </div>
        </Modal>
    )
}

NewMessageModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    projectTeam: PropTypes.arrayOf(PropTypes.shape({
        user: PropTypes.string.isRequired,
    })).isRequired,
    onSelectUser: PropTypes.func.isRequired,
    currentUserId: PropTypes.string.isRequired,
}

export default NewMessageModal
