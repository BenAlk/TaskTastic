import {useContext, useRef, useEffect} from 'react'
import { DropdownContext } from './Dropdown'
import testData from './testData/testData'
import PropTypes from 'prop-types'

const DropdownList = ({styling = {}, isProjectsPage= false, createNewProject}) => {
    const {isOpen, toggleDropdown, selectedProject, setSelectedProject, onSelectProject, arrowRef} = useContext(DropdownContext)
    const dropdownRef = useRef(null)
    
    const newProject = {
        id: 10,
        name: "New Project",
        status: "Active",
        tasks: null
    }

    const handleItemClick = (project) => {
        setSelectedProject(project)
        onSelectProject(project)
        toggleDropdown()
    }

    const handleCreateNewProject = () => {
        createNewProject()
        toggleDropdown()
        setSelectedProject(newProject)
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                arrowRef.current && !arrowRef.current.contains(event.target)) {
                if (isOpen) {
                    toggleDropdown(); // Close the dropdown if clicking outside
                }
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, arrowRef, toggleDropdown]);

    return (
        <div ref={dropdownRef} className={`dropdown-list ${isOpen ? 'open' : ''}`} style={styling}>
            <div className={`dropdown-placeholder ${selectedProject ? "active-project" : ""}`} 
            onClick={(e) => {
                e.stopPropagation()
                toggleDropdown()
                }}>
                {selectedProject ? `${selectedProject.name}` : "Choose from the list."}
            </div>
            {testData?.map((project) => (
                <div className="dropdown-item" onClick={() => handleItemClick(project)} key={project.id}>
                    {project.name}
                </div>
            ))}
            {isProjectsPage && <div className="dropdown-item create-new-project" onClick={handleCreateNewProject}>Create new project</div>}
        </div>
    );
};

DropdownList.propTypes = {
    styling: PropTypes.object,
    isProjectsPage: PropTypes.bool,
    createNewProject: PropTypes.func.isRequired
};

export default DropdownList;