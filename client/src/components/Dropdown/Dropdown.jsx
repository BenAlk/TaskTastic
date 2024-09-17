import {createContext, useState, useRef} from "react"
import "./styles/Dropdown.css"
import PropTypes from "prop-types"
import { ArrowIcon } from "../../assets/icons"


const DropdownContext = createContext()
export {DropdownContext}

const Dropdown = ({children, styling={}, onSelectProject, isSideBarOpen}) => {

    const [isOpen, setIsOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)
    const arrowRef = useRef(null);

    const toggleDropdown = () => setIsOpen(prevIsOpen => !prevIsOpen)

    return (
    <DropdownContext.Provider value={{ isOpen, toggleDropdown, selectedProject, setSelectedProject, onSelectProject, arrowRef}}>
        <div className={`dropdown ${isSideBarOpen ? "" : "slide"}`} style={styling}>
            {children}
            <div className="dropdown-arrow" onClick={toggleDropdown} ref={arrowRef}>
                <ArrowIcon width="13px" height="6px" fill="var(--primary-color)" className={`arrow-image ${isOpen ? "rotate180" : ""}`}/>
            </div>
        </div>
    </DropdownContext.Provider>
)
}

Dropdown.propTypes = {
    children: PropTypes.node.isRequired,             
    styling: PropTypes.object,                                          
    onSelectProject: PropTypes.func,
    isSideBarOpen: PropTypes.bool               
};

export default Dropdown