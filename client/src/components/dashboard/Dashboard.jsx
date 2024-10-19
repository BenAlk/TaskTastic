import styles from "./Dashboard.module.css"
import TimelineSection from "./TimelineSection/TimelineSection"
import ActivitySection from "./ActivitySection"
import TaskSection from "./TaskSection"
import MessageSection from "./MessageSection"
import { useProjectContext } from "../../context/ProjectContext"


export const Dashboard = () => {

    const { currentProject } = useProjectContext();
    console.log("currentproject : : : ", currentProject)
    return (
        <div className={styles['dashboard-container']}>
            <div className={styles['card-container']}>
                <div className={styles['card-title-container']}>
                    <h2>Timeline</h2>
                </div>
                <div className={styles['card-content-container']}>
                    {currentProject ? <TimelineSection /> : <h3>Select a project to view data</h3>}
                </div>
            </div>
            <div className={styles['card-container']}>
                <div className={styles['card-title-container']}>
                    <h2>Activity</h2>
                </div>
                <div className={styles['card-content-container']}>
                    {currentProject ? <ActivitySection /> : <h3>Select a project to view data</h3>}
                </div>
            </div>
            <div className={styles['card-container']}>
                <div className={styles['card-title-container']}>
                    <h2>Tasks</h2>
                </div>
                <div className={styles['card-content-container']}>
                    {currentProject ? <TaskSection /> : <h3>Select a project to view data</h3>}
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
