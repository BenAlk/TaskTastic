import { useState, useEffect, useRef } from 'react';
import PropTypes from "prop-types";
import { ArrowIcon } from "../../assets/icons";
import "./styles/ProjectSelector.css";

const ProjectSelector = ({ projectList, onProjectSelect, chosenProject }) => {

    const containerRef = useRef(null);
    const [projectWidth, setProjectWidth] = useState(0);

    const updateVisibleProjectsCount = () => {
        if (containerRef.current) {
            const container = containerRef.current;

            const project = container.querySelector('.project-selector-name');
            if (project) {
                const width = project.offsetWidth + parseFloat(getComputedStyle(project).marginRight);
                setProjectWidth(width);
            }
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                containerRef.current.scrollLeft = 0; // Optionally reset scroll position on resize
            }
        }

        updateVisibleProjectsCount();
        window.addEventListener('resize', updateVisibleProjectsCount, handleResize);

        return () => window.removeEventListener('resize', updateVisibleProjectsCount, handleResize);
    }, [projectList]);

    const handleNext = () => {
        if (containerRef.current) {
            const container = containerRef.current;
            const scrollAmount = (projectWidth * 6)
            container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handlePrevious = () => {
        if (containerRef.current) {
            const container = containerRef.current;
            const scrollAmount = (-projectWidth * 6);
            container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    
    const handleProjectClick = (project) => {
        if (onProjectSelect) {
            onProjectSelect(project);
        }
    };

    if (projectList === null || projectList.length === 0) {
        return (
        <div className="dashboard-project-selector">
            <div className="no-projects-message">No projects available, create your first project!</div>
        </div>
        )
    }

    return (
        <div className="dashboard-project-selector">
                {projectList.length > 1 ? (
                <>
                    <div className="project-selector-title">
                        Select a Project
                    </div>
                    <div
                        className="project-selector-arrow arrow-left"
                        onClick={handlePrevious}
                    >
                        <ArrowIcon className="project-selector-arrow-icon"/>
                    </div>
                </>)  
                : null}

            <div className="project-list" ref={containerRef}>
                {(projectList.length > 0) && projectList.map((project, index) => (
                    <div className={`project-selector-name ${chosenProject?.projectName === project.projectName ? "active" : ""}`} key={index} onClick={() => handleProjectClick(project)}>
                        <h2>{project.projectName}</h2>
                    </div>
                ))}
            </div>

            {projectList.length > 1 ? 
            <div
                className="project-selector-arrow arrow-right"
                onClick={handleNext}
            >
                <ArrowIcon className="project-selector-arrow-icon"/>
            </div>  : null}
        </div>
    );
};

ProjectSelector.propTypes = {
    projectList: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.shape({
            projectName: PropTypes.string.isRequired,
        })),
        PropTypes.oneOf([null])
    ]),
    onProjectSelect: PropTypes.func,
    chosenProject: PropTypes.object
};

export default ProjectSelector;