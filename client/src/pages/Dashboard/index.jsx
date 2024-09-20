import { useState } from "react"
import PropTypes from "prop-types"
import { useOutletContext } from "react-router-dom"
import { projects } from "./testData/testData"
import ProjectSelector from '../../components/ProjectSelector/ProjectSelector'
import Card from "../../components/Card/Card"
import TaskTile from "../../components/TaskTile/TaskTile"
import ActivityTile from "../../components/ActivityTile/ActivityTile"
import "./styles/Dashboard.css"

const Dashboard = () => {
    const [chosenProject, setChosenProject] = useState(null)
    const { isSideBarOpen } = useOutletContext();

    const handleProjectSelect = (project) => {
        setChosenProject(project);
    };

    return (
        <div className={`main-container ${isSideBarOpen ? "" : "slide"}`}>
            <ProjectSelector 
                projectList={projects.projectList} 
                onProjectSelect={handleProjectSelect}
                chosenProject={chosenProject}
            />
            <div className="dashboard-container">
                <Card className="barchart-kanban" >{chosenProject ? <TaskTile project={chosenProject} height={"90%"} width={"100%"} /> : "Choose a project above to display data."}</Card>
                <Card className="activity-tile" >{chosenProject ? <ActivityTile project={chosenProject} height={"90%"} width={"100%"} /> : "Choose a project above to display data."}</Card>
                <Card >Card 3</Card>
                <Card >Card 4</Card>
            </div>
            
        </div>
    );
};

export default Dashboard;

Dashboard.propTypes = {
    isSideBarOpen: PropTypes.bool
};
