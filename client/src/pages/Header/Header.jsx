import { useState } from "react"
import logo from "../../assets/Logo.jpeg"
import "./styles/Header.css"
import { Link } from "react-router-dom"
import Dropdown from "../../components/Dropdown/index"
import PropTypes from "prop-types"

const Header = ({isSideBarOpen}) => {

    const [selectedProject, setSelectedProject] = useState(null)

    const handleSelectProject = (project) => {
        setSelectedProject(project)
    }

    return (
        <div className="header-container">
            <div className="dropdown-container">
                <Dropdown 
                    onSelectProject={handleSelectProject}
                    isSideBarOpen={isSideBarOpen}
                >
                    <Dropdown.Label>
                        {selectedProject ? "Chosen Project" : "Select an option"}
                    </Dropdown.Label>
                    <Dropdown.List onSelectProject={handleSelectProject} />
                </Dropdown>
            </div>
            <Link to="/" className="header-logo-link">
                <div className="header-logo">
                    <h1>TaskTastic</h1>
                    <img src={logo} alt="logo" />
                </div>
            </Link>
        </div>
    )
}

export default Header

Header.propTypes = {
    isSideBarOpen: PropTypes.bool
}