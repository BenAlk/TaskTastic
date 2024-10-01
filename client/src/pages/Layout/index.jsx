import { useState } from "react"
import { Outlet } from "react-router-dom"
import Header from "../Header/Header"
import NavBar from "../NavBar/NavBar"
import { projects } from "../../features/Dashboard/testData/testData"

const Layout = () => {

    const [isOpen, setIsOpen] = useState(true)
    const [chosenProject, setChosenProject ] = useState(null)

    const handleProjectSelect = (project) => {
        setChosenProject(project);
    };

    const handleMenuToggle = () => {
        setIsOpen(!isOpen)
        console.log(isOpen)
    }

    return (
        <div className="layout-container">
            <NavBar isOpen={isOpen} handleMenuToggle={handleMenuToggle} />
            <Header isSideBarOpen={isOpen} onProjectSelect={handleProjectSelect} chosenProject={chosenProject} projects={projects} />
            <Outlet context={{isSideBarOpen: isOpen, chosenProject: chosenProject, projects: projects}}/>
        </div>
    )
}

export default Layout
