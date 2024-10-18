import PropTypes from "prop-types"
import { useOutletContext,  } from "react-router-dom"
import Card from "../../components/Card/Card"
import TaskTile from "./components/TaskTile/TaskTile"
import ActivityTile from "./components/ActivityTile/ActivityTile"
import TimeLineTile from "./components/TimeLineTile/TimeLineTile"
import MessageTile from "./components/MessageTile/MessageTile"
import "./styles/Dashboard.css"

const Dashboard = () => {

    const { isSideBarOpen, chosenProject } = useOutletContext();

    return (
        <div className={`main-container ${isSideBarOpen ? "" : "slide"}`}>

            <div className="dashboard-container">
                <Card className={`dashboard-card ${chosenProject ? "" : "placeholder-card"}`}>{chosenProject ? <TimeLineTile project={chosenProject} /> : <h3>Choose a project above to display data.</h3>}</Card>
                <Card className={`dashboard-card ${chosenProject ? "" : "placeholder-card"}`}>{chosenProject ? <TaskTile project={chosenProject} height={"90%"} width={"100%"} /> : <h3>Choose a project above to display data.</h3>}</Card>
                <Card className={`dashboard-card ${chosenProject ? "" : "placeholder-card"}`}>{chosenProject ? <ActivityTile project={chosenProject} height={"90%"} width={"100%"} /> : <h3>Choose a project above to display data.</h3>}</Card>
                <Card className={`dashboard-card ${chosenProject ? "" : "placeholder-card"}`}>{chosenProject ? <MessageTile project={chosenProject} /> : <h3>Choose a project above to display data.</h3>}</Card>
            </div>

        </div>
    );
};

export default Dashboard;

Dashboard.propTypes = {
    isSideBarOpen: PropTypes.bool
};
