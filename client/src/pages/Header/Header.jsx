// import { useState } from "react"
import logo from "../../assets/Logo.jpeg"
import "./styles/Header.css"
//import { Link } from "react-router-dom"
// import Dropdown from "../../components/Dropdown/index"
import PropTypes from "prop-types"

const user = {
    name: "Ben"
}

const Header = ({isSideBarOpen}) => {

    return (
        <div className={`header-container ${isSideBarOpen ? "" : "slide"}`}>
            <div className="welcome-container">Welcome back, {user.name}! </div>
            <div className="logo-container">
                <img src={logo} alt="logo" />
            </div>
        </div>
    )
}

export default Header

Header.propTypes = {
    isSideBarOpen: PropTypes.bool
}