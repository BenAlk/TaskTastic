import {useState, useEffect } from 'react';
import PropTypes from "prop-types"
import RiskCard from "../RiskCard/RiskCard"
import "./styles/TimeLineTile.css"

const TimeLineTile = ({ project}) => {
    const [taskProgress, setTaskProgress] = useState(0);
    const [timelineProgress, setTimelineProgress] = useState(0);
    const [daysLeft, setDaysLeft] = useState(0);

    useEffect(() => {
        const calculateProgress = () => {
            const today = new Date();
            const startDate = new Date(project.projectStartDate);
            const targetDate = new Date(project.projectTargetDate);

        //Calculate progress based on task completion
            const totalTasks = project.tasks.length;
            const completedTasks = project.tasks.filter(task => task.completedDate).length;
            const taskProgressValue = Math.round((completedTasks / totalTasks) * 100);
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
            const {taskProgress, timelineProgress, daysLeft} = calculateProgress();
            setTaskProgress(taskProgress);
            setTimelineProgress(timelineProgress);
            setDaysLeft(daysLeft);
        }, 50);

        return () => clearTimeout(timer);
    }, [project]);

    return (
        <div className="timeline-risk-container">
            <div className="project-timeline">
                <h2 className="project-title">{project.projectName} Timeline</h2>
                <div className="date-container">
                    <span>Start: {project.projectStartDate}</span>
                    <span>Target: {project.projectTargetDate}</span>
                </div>
                <div className="progress-container">
                    <div className="progress-bar-background"></div>
                    <div className="progress-bar-tasks" style={{width: `${taskProgress}%`}} title={`${taskProgress}% Complete`}></div>
                    <div className="progress-bar-timeline" style={{width: `${timelineProgress}%`, backgroundColor: `${timelineProgress >= 70 ? "#ff0000" : (timelineProgress >= 40 ? "#F59E0B" : "#66e352")}`} } title={`${timelineProgress}% `}></div>
                </div>
                <div className="progress-label-container">
                        <span className="progress-label">{taskProgress}% Complete</span>
                        <span className="timeline-label" style={{color: `${timelineProgress >= 70 ? "#ff0000" : timelineProgress >= 40 ? "#F59E0B" : "#006400"}`}}>{daysLeft} days left.</span>
                    </div>
            </div>
            <div className="risk-container">
                { !project.risks || project.risks.length < 1 ? 
                    <h2>There are currently no tasks flagged for concern.</h2> : 
                    (
                        <div className="risk-list">
                            <h2>Tasks flagged for concern.</h2>
                            {project.risks.map((risk, index) => (
                                <RiskCard risk={risk} key={index} project={project} />
                            ))}
                        </div>
                    )}
            </div>

        </div>
    );
};

TimeLineTile.propTypes = {
    project: PropTypes.shape({
        projectName: PropTypes.string.isRequired,
        projectStartDate: PropTypes.string.isRequired,
        projectTargetDate: PropTypes.string.isRequired,
        tasks: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
            completedDate: PropTypes.string,

        })),
        team: PropTypes.shape({
            members: PropTypes.arrayOf(PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string,
                role: PropTypes.string
            }))
        }),
        risks: PropTypes.arrayOf(PropTypes.shape({
            riskLevel: PropTypes.string.isRequired,
            riskFactors: PropTypes.shape({
                timeline: PropTypes.number.isRequired,
                budget: PropTypes.number.isRequired,
                dependencies: PropTypes.number.isRequired,
                resources: PropTypes.number.isRequired,
                complexity: PropTypes.number.isRequired,
                total: PropTypes.number.isRequired
            })
        }))
    })    
};

export default TimeLineTile;

