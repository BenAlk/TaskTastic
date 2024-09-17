import { useState } from "react"
import { Outlet } from "react-router-dom"
import Header from "../Header/Header"
import NavBar from "../NavBar/NavBar"


const Layout = () => {

    const [isOpen, setIsOpen] = useState(true)

    const handleMenuToggle = () => {
        setIsOpen(!isOpen)
        console.log(isOpen)
    }

    return (
        <div className="layout-container">
            <NavBar isOpen={isOpen} handleMenuToggle={handleMenuToggle} />
            <Header isSideBarOpen={isOpen} />
            <Outlet context={{isSideBarOpen: isOpen}}/>
        </div>
    )
}

export default Layout