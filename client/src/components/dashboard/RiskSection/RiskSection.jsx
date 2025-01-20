import RiskCard from '../RiskCard/RiskCard'
import styles from './RiskSection.module.css'
import { useProjectContext } from '../../../context/ProjectContext'

const RiskSection = () => {
    const { tasksAtRisk, riskLoading } = useProjectContext()

    if (riskLoading) {
        return <div>Loading risks...</div>
    }

    return (
        <div className={styles['container']}>
            <div className={styles['header']}>
                <p className={styles['subtitle']}>Tasks requiring immediate attention</p>
            </div>
            <div className={styles['risk-list']}>
                {tasksAtRisk.map((task) => (
                    !task?.completed?.isCompleted &&
                    <RiskCard
                        key={task._id}
                        task={task}
                    />
                ))}
                {tasksAtRisk.length === 0 && (
                <div className={styles['empty-state']}>
                    <p>No tasks currently at risk</p>
                </div>
            )}
            </div>

        </div>
    )
}

export default RiskSection
