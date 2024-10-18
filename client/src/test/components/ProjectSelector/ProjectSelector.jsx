import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ArrowIcon, EditIcon, CreateIcon, TrashIcon } from '../../assets/icons';
import './styles/ProjectSelector.css';

const ProjectSelector = ({ projectList, onProjectSelect, chosenProject }) => {
    const navigate = useNavigate();
    const location = useLocation();
	const containerRef = useRef(null);
	const [showArrows, setShowArrows] = useState(false);
	const [currentIndex, setCurrentIndex] = useState(0);

	const updateArrowVisibility = () => {
		if (containerRef.current) {
			const container = containerRef.current;
			setShowArrows(container.scrollWidth > container.clientWidth);
		}
	};

	useEffect(() => {
		updateArrowVisibility();
		window.addEventListener('resize', updateArrowVisibility);

		return () =>
			window.removeEventListener('resize', updateArrowVisibility);
	}, [projectList]);

	const handleScroll = (direction) => {
		const container = containerRef.current;
		if (!container) return;

		const itemWidth = container.offsetWidth / 3;
		const totalItems = projectList.length;

		let newIndex;
		if (direction === 'next') {
			newIndex = Math.min(currentIndex + 3, totalItems - 3);
		} else {
			newIndex = Math.max(currentIndex - 3, 0);
		}

		setCurrentIndex(newIndex);
		container.scrollTo({
			left: newIndex * itemWidth,
			behavior: 'smooth',
		});
	};

	const handleProjectClick = (project) => {
		if (onProjectSelect) {
			onProjectSelect(project);
            if(location.pathname === "/NewProject") {
                navigate("/");
            }
		}
	};

    const createNewProject = () => {
        onProjectSelect(null)
    }

	if (projectList === null || projectList.length === 0) {
		return (
			<div className='dashboard-project-selector no-projects'>
				<div className='no-projects-message'>
					No projects available, create your first project!
				</div>
				<div className='create-new-project-button no-active-projects'>
					<CreateIcon backgroundFill='rgb(8, 175, 8)' />
				</div>
			</div>
		);
	}

	return (
		<div className='dashboard-project-selector'>
			{projectList.length > 0 && (
				<>
                <div className='project-selector-title'>Projects</div>
                <div className='project-button-container'>
				<Link
                    to="/NewProject"
                    onClick={createNewProject}
					className='create-new-project-button'
					title='Create New Project'
				>
					<CreateIcon backgroundFill='rgb(8, 175, 8)' />
				</Link>
				<div
					className='edit-current-project-button'
					title='Edit Current Project'
				>
					<EditIcon />
				</div>
				<div
					className='delete-current-project-button'
					title='Delete Current Project'
				>
					<TrashIcon />
				</div>
			</div>
            </>
			)}
            <>
			<div className='project-selector-arrow-container'>
				{showArrows && currentIndex > 0 && (
					<div
						className='project-selector-arrow arrow-left'
						onClick={() => handleScroll('previous')}
					>
						<ArrowIcon className='project-selector-arrow-icon' />
					</div>
				)}
			</div>

			<div
				className={`project-list ${
					projectList.length < 3 ? 'no-scroll' : ''
				}`}
				ref={containerRef}
			>
				{projectList.map((project, index) => (
					<div
						className={`project-selector-name ${
							chosenProject?.projectName === project.projectName
								? 'active'
								: ''
						}`}
						key={index}
						onClick={() => handleProjectClick(project)}
					>
						<h2>{project.projectName}</h2>
					</div>
				))}
			</div>
			<div className='project-selector-arrow-container'>
				{showArrows && currentIndex < projectList.length - 3 && (
					<div
						className='project-selector-arrow arrow-right'
						onClick={() => handleScroll('next')}
					>
						<ArrowIcon className='project-selector-arrow-icon' />
					</div>
				)}
			</div>
            </>


		</div>
	);
};

ProjectSelector.propTypes = {
	projectList: PropTypes.arrayOf(
		PropTypes.shape({
			projectName: PropTypes.string.isRequired,
		})
	),
	onProjectSelect: PropTypes.func,
	chosenProject: PropTypes.object,
};

export default ProjectSelector;
