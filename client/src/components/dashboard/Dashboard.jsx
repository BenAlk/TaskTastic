import styles from "./Dashboard.module.css"
import TimelineSection from "./TimelineSection/TimelineSection"
import ActivitySection from "./ActivitySection/ActivitySection"
import TaskSection from "./TaskSection/TaskSection"
import MessageSection from "./MessageSection/MessageSection"
import { useProjectContext } from "../../context/ProjectContext"


export const Dashboard = () => {
console.log("rendering dashboard")
    const { currentProject } = useProjectContext();
    console.log("currentproject : : : ", currentProject)
    return (
        <div className={styles['dashboard-container']}>
            <div className={styles['card-container']}>
                <div className={styles['card-title-container']}>
                    <h2>Timeline</h2>
                </div>
                <div className={styles['card-content-container']}>
                    {currentProject ? <TimelineSection height={"90%"} width={"100%"}/> : <h3>Select a project to view data</h3>}
                </div>
            </div>
            <div className={styles['card-container']}>
                <div className={styles['card-title-container']}>
                    <h2>Activity</h2>
                </div>
                <div className={styles['card-content-container']}>
                    {currentProject ? <ActivitySection height={"90%"} width={"100%"} /> : <h3>Select a project to view data</h3>}
                </div>
            </div>
            <div className={styles['card-container']}>
                <div className={styles['card-title-container']}>
                    <h2>Tasks</h2>
                </div>
                <div className={styles['card-content-container']}>
                    {currentProject ? <TaskSection height={"90%"} width={"100%"} /> : <h3>Select a project to view data</h3>}
                </div>
            </div>
            <div className={styles['card-container']}>
                <div className={styles['card-title-container']}>
                    <h2>Messages</h2>
                </div>
                <div className={styles['card-content-container']}>
                    {currentProject ? <MessageSection /> : <h3>Select a project to view data</h3>}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
