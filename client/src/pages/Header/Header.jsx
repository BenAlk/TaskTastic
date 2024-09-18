// import { useState } from "react"
import logo from "../../assets/logo.jpg"
import "./styles/Header.css"
import { Link } from "react-router-dom"
// import Dropdown from "../../components/Dropdown/index"
import PropTypes from "prop-types"

const user = {
    name: "Ben"
}

const Header = ({isSideBarOpen}) => {

    return (
        <div className={`header-container ${isSideBarOpen ? "" : "slide"}`}>
            <div className="welcome-container">Welcome back, {user.name}!</div>
            {/* <div className="header-project-selector">
                <h3>Select a Project</h3>
            </div> */}
            < Link to="/" className="logo-container">
                <img src={logo} alt="logo" />
            </Link>
        </div>
    )
}

export default Header

Header.propTypes = {
    isSideBarOpen: PropTypes.bool
}