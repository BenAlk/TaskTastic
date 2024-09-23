import logo from "../../assets/logo.jpg"
import "./styles/Header.css"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"
import ProjectSelector from "../../components/ProjectSelector/ProjectSelector"
import { projects } from "../Dashboard/testData/testData"
const user = {
    name: "Ben"
}

const Header = ({isSideBarOpen, onProjectSelect, chosenProject}) => {

    return (
        <div className={`header-container ${isSideBarOpen ? "" : "slide"}`}>
            <div className="main-header">
                <div className="welcome-container">Welcome back, {user.name}!</div>
                < Link to="/" className="logo-container">
                    <img src={logo} alt="logo" />
                </Link>
            </div>
            <ProjectSelector 
                projectList={projects.projectList} 
                onProjectSelect={onProjectSelect}
                chosenProject={chosenProject}
                />
        </div>
    )
}

export default Header

Header.propTypes = {
    isSideBarOpen: PropTypes.bool,
    onProjectSelect: PropTypes.func,
    chosenProject: PropTypes.object
}