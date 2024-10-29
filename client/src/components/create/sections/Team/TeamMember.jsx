import PropTypes from 'prop-types'
import {motion} from 'framer-motion'
import styles from './TeamMember.module.css'

const TeamMember = ({ member, onRemove, onToggleAdmin, canBeAdmin, isOwner }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0}}
            exit={{ opacity: 0, y: -20 }}
            className={styles['container']}
        >
            <div className={styles['member-info']}>
                {member.role === 'admin' ? (
                    <h2>AdminIcon</h2> )
                    : (
                        <h2>PersonIcon</h2>
                    )}
                    <span className={styles['email']}>{member.email}</span>
                    {isOwner && <span className={styles['owner-badge']}>Owner</span>}
            </div>

            <div className={styles['actions']}>
                {canBeAdmin && !isOwner && (
                    <button
                        onClick={() => onToggleAdmin(member.user)}
                        className={`${styles['admin-button']} ${member.role === 'admin' ? styles['active'] : ''}`}
                    >
                        Admin
                    </button>
                )}
                {!isOwner && (
                    <button
                        onClick={() => onRemove(member.user)}
                        className={styles['remove-button']}
                        aria-label="Remove team member"
                    >
                        DeleteIcon
                    </button>
                )}
            </div>
        </motion.div>
    )
}

TeamMember.propTypes = {
    member: PropTypes.shape({
        user: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.oneOf(['admin', 'member'])
    }),
    onRemove: PropTypes.func,
    onToggleAdmin: PropTypes.func,
    canBeAdmin: PropTypes.bool,
    isOwner: PropTypes.bool
}

export default TeamMember
