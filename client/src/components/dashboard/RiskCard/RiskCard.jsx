import PropTypes from 'prop-types'
import { AlertTriangle, Clock, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserContext } from '../../../context/UserContext'
import styles from './RiskCard.module.css'

const RiskCard = ({ task }) => {
    const [assignedUser, setAssignedUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const { getUserDetails } = useUserContext();
    const navigate = useNavigate();

    const handleRiskCardClick = () => {
        navigate(`/tasks?taskId=${task._id}`)
    }

    useEffect(() => {
        const fetchUserData = async () => {
            if (task.assignedTo) {
                try {
                    const userData = await getUserDetails(task.assignedTo)
                    setAssignedUser(userData)
                } catch (error) {
                    console.error('Failed to fetch user data:', error)
                }
            }
            setLoading(false)
        };

        fetchUserData()
    }, [task.assignedTo])

    if (!task) {
        return null
    }

    const {
        title = "Untitled Task",
        description = "",
        risk = {},
        dueDate
    } = task

    const formattedDueDate = dueDate
        ? new Date(dueDate).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
        : 'No due date'

    const userDisplayName = assignedUser
        ? `${assignedUser.firstName} ${assignedUser.lastName}`.trim() || assignedUser.email
        : 'Loading...'

    return (
        <div className={styles['risk-card']}
            onClick={handleRiskCardClick}
        >
            <div className={styles['risk-banner']}>
                <div className={styles['risk-type']}>
                    <AlertTriangle color="white" size={20} />
                    <span className={styles['risk-type-text']}>
                        {risk.riskType || 'Unknown'} Risk
                    </span>
                </div>
                <span className={styles['flagged-by']}>
                    Flagged by {risk.flaggedBy || 'system'}
                </span>
            </div>

            <div className={styles['content']}>
                <div className={styles['risk-information']}>
                    <h3 className={styles['title']}>{title}</h3>
                    <p className={styles['description']}>
                        {risk.riskDescription || description}
                    </p>
                </div>

                <div className={styles['metadata']}>
                    <div className={styles['metadata-item']}>
                        <Clock size={16} />
                        <span>Due {formattedDueDate}</span>
                    </div>
                    {!loading && task.assignedTo && (
                        <div className={styles['metadata-item']}>
                            <User size={16} />
                            <span>{userDisplayName}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

RiskCard.propTypes = {
    task: PropTypes.shape({
        _id: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        assignedTo: PropTypes.string,
        dueDate: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.instanceOf(Date)
        ]),
        risk: PropTypes.shape({
            isAtRisk: PropTypes.bool,
            riskType: PropTypes.string,
            riskDescription: PropTypes.string,
            flaggedBy: PropTypes.oneOf(['user', 'system']),
            flaggedByUserId: PropTypes.string,
            flaggedAt: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.instanceOf(Date)
            ])
        })
    }).isRequired
}

export default RiskCard
