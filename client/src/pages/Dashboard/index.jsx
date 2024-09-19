import { useState } from "react"
import PropTypes from "prop-types"
import { useOutletContext } from "react-router-dom"
import { projects } from "./testData/testData"
import ProjectSelector from '../../components/ProjectSelector/ProjectSelector'
import Card from "../../components/Card/Card"
import BarChartKanBan from "../../components/BarChartKanBan/BarChartKanBan"
import PieChartTasks from "../../components/PieChartTasks/PieChartTasks"

import "./styles/Dashboard.css"

const Dashboard = () => {
    const [chosenProject, setChosenProject] = useState(null)
    const { isSideBarOpen } = useOutletContext();
    // const [pieChartSize, setPieChartSize] = useState({ width: 0, height: 0 });
    // const pieChartCardRef = useRef(null);

    const handleProjectSelect = (project) => {
        setChosenProject(project);
    };

    // useEffect(() => {
    //     const updatePieChartSize = () => {
    //         if (pieChartCardRef.current) {
    //             const containerHeight = pieChartCardRef.current.offsetHeight;
    //             setPieChartSize({
    //                 width: containerHeight * 1.2,  // 90% of container height for width
    //                 height: containerHeight * 0.5  // 50% of container height
    //             });
    //         }
    //     };

    //     updatePieChartSize();
    //     window.addEventListener('resize', updatePieChartSize);

    //     return () => window.removeEventListener('resize', updatePieChartSize);
    // }, []);

    // console.log(pieChartSize)

    return (
        <div className={`main-container ${isSideBarOpen ? "" : "slide"}`}>
            <ProjectSelector 
                projectList={projects.projectList} 
                onProjectSelect={handleProjectSelect}
                chosenProject={chosenProject}
            />
            <div className="dashboard-container">
                <Card className="barchart-kanban" >{chosenProject ? <BarChartKanBan project={chosenProject} /> : "Choose a project above to display data."}</Card>
                <Card className="piechart-tasks" >{chosenProject ? <PieChartTasks project={chosenProject}/>: "Choose a project above to display data."}</Card>
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
