import { useState, useEffect } from 'react'
import PropTypes from "prop-types"
import RiskCard from "../Risk/RiskCard"
import { useProjectContext } from "../../../context/ProjectContext"
import styles from "./TimelineSection.module.css"

const TimelineSection = () => {
    const { currentProject } = useProjectContext()
    const [taskProgress, setTaskProgress] = useState(0);
    const [timelineProgress, setTimelineProgress] = useState(0);
    const [daysLeft, setDaysLeft] = useState(0);

    useEffect(() => {
        const calculateProgress = () => {
            const today = new Date();
            const startDate = new Date(currentProject.startDate);
            const targetDate = new Date(currentProject.targetDate);

            //Calculate progress based on task completion
            const totalTasks = currentProject.tasks?.length;
            const completedTasks = currentProject.tasks?.filter(task => task.completedDate).length;
            const taskProgressValue = () => {
                if(!currentProject.tasks) {
                    return 0;
                } else {
                    Math.round((completedTasks / totalTasks) * 100);
                }
            }
            //Calculate progress based on date completion
            const totalDays = (targetDate - startDate) / (1000 * 60 * 60 * 24);
            const daysPassed = Math.max(0, (today - startDate) / (1000 * 60 * 60 * 24));
            const timelineProgressValue = Math.min(100, Math.max(0, Math.round((daysPassed / totalDays) * 100)));
            const daysLeft = Math.max(0, Math.round((targetDate - today) / (1000 * 60 * 60 * 24)));
            return { taskProgress: taskProgressValue, timelineProgress: timelineProgressValue, daysLeft: daysLeft };
        };

        // Set initial progress to 0
        setTaskProgress(0);
        setTimelineProgress(0);
        setDaysLeft(0);

        // Use setTimeout to trigger the animation
        const timer = setTimeout(() => {
            const { taskProgress, timelineProgress, daysLeft } = calculateProgress();
            setTaskProgress(taskProgress);
            setTimelineProgress(timelineProgress);
            setDaysLeft(daysLeft);

            console.log('Task Progress:', taskProgress);
            console.log('Timeline Progress:', timelineProgress);
            console.log('Days Left:', daysLeft);
        }, 50);

        return () => clearTimeout(timer);
    }, [currentProject]);


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
                { !currentProject.risks || currentProject.risks?.length < 1 ?
                    <h2>There are currently no tasks flagged for concern.</h2> :
                    (
                        <div className={styles['risk-list']}>
                            <h3>Tasks flagged for concern.</h3>
                            {currentProject.risks?.map((risk, index) => (
                                <RiskCard risk={risk} key={index} project={currentProject} />
                            ))}
                        </div>
                    )}
                </div>
        </div>
    )
}

export default TimelineSection
