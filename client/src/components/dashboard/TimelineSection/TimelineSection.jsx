import { useState, useEffect } from 'react'
import RiskSection from "../RiskSection/RiskSection"
import { useProjectContext } from "../../../context/ProjectContext"
import { useTaskContext } from "../../../context/TaskContext"
import styles from "./TimelineSection.module.css"

const TimelineSection = () => {
    const { currentProject } = useProjectContext()
    const { tasks, fetchTasks } = useTaskContext()
    const [taskProgress, setTaskProgress] = useState(0)
    const [timelineProgress, setTimelineProgress] = useState(0)
    const [daysLeft, setDaysLeft] = useState(0)

    useEffect(() => {
        if (currentProject?._id) {
            fetchTasks(currentProject._id)
        }
    }, [currentProject?._id])

    useEffect(() => {
        const calculateProgress = () => {
            const today = new Date()
            const startDate = new Date(currentProject.startDate)
            const targetDate = new Date(currentProject.targetDate)

            const totalTasks = tasks.length;
            const completedTasks = tasks.filter(task => task.completed?.isCompleted).length
            const taskProgressValue = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

            const totalDays = (targetDate - startDate) / (1000 * 60 * 60 * 24)
            const daysPassed = Math.max(0, (today - startDate) / (1000 * 60 * 60 * 24))
            const timelineProgressValue = Math.min(100, Math.max(0, Math.round((daysPassed / totalDays) * 100)))
            const daysLeft = Math.max(0, Math.round((targetDate - today) / (1000 * 60 * 60 * 24)))

            return { taskProgress: taskProgressValue, timelineProgress: timelineProgressValue, daysLeft }
        }

        setTaskProgress(0)
        setTimelineProgress(0)
        setDaysLeft(0)

        const timer = setTimeout(() => {
            const { taskProgress, timelineProgress, daysLeft } = calculateProgress()
            setTaskProgress(taskProgress)
            setTimelineProgress(timelineProgress)
            setDaysLeft(daysLeft)
        }, 50)

        return () => clearTimeout(timer)
    }, [currentProject, tasks])


    return (
        <div className={styles['timeline-section']}>
            <div className={styles['project-timeline']}>
                <div className={styles['task-label']}>{taskProgress}% Complete</div>
                <div className={styles['timeline-label']} style={{ color: `${timelineProgress >= 70 ? "#ff0000" : timelineProgress >= 40 ? "#F59E0B" : "#006400"}` }}>{daysLeft} days left.</div>
                <div className={styles['progress-container']}>
                    <div className={styles['progress-bar-background']}></div>
                    <div className={styles['progress-bar-tasks']} style={{ width: `${taskProgress}%` }} title={`${taskProgress}% Complete`}></div>
                    <div className={styles['progress-bar-timeline']} style={{ width: `${timelineProgress}%`, backgroundColor: `${timelineProgress >= 70 ? "#ff0000" : (timelineProgress >= 40 ? "#F59E0B" : "#66e352")}` }} title={`${timelineProgress}% `}></div>
                </div>
                <div className={styles['date-container']}>
                    <span>Start: {new Date(currentProject.startDate).toLocaleString(undefined, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })}</span>
                    <span>Target: {new Date(currentProject.targetDate).toLocaleString(undefined, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })}</span>
                </div>
            </div>
            <div className={styles['risk-container']}>
                <RiskSection />
            </div>
        </div>
    )
}

export default TimelineSection
