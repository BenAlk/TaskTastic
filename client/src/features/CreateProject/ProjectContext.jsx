import { createContext, useState, useContext, useCallback } from 'react';
import { createInitialProjectData } from './utils/projectDataUtils';
import PropTypes from 'prop-types';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
    const [projectData, setProjectData] = useState(createInitialProjectData());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errors, setErrors] = useState({})


    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setProjectData(prevData => ({
        ...prevData,
        [id]: value
        }));
    };

    const handleOptionsChange = useCallback((updatedOption) => {
        setProjectData(prevData => ({
        ...prevData,
        options: {
            ...prevData.options,
            ...updatedOption
        }
        }));
    }, []);

    const handleDateChange = (field, date) => {
        setProjectData(prevData => ({
        ...prevData,
        [field]: date,
        }));
    };

    const handleAddTeamMember = (newMember) => {
        setProjectData(prevData => ({
        ...prevData,
        team: [...prevData.team, newMember]
        }));
    };

    const handleToggleAdmin = useCallback((memberId) => {
        setProjectData(prevData => ({
            ...prevData,
            team: prevData.team.map(member =>
                member.id === memberId
                ? { ...member, admin: !member.admin }
                : member
            )
        }));
    }, []);

    const handleDeleteMember = (memberId) => {
        setProjectData(prevData => ({
        ...prevData,
        team: prevData.team.filter(member => member.id !== memberId)
        }));
    };

    return (
        <ProjectContext.Provider value={{
        projectData,
        setProjectData,
        isModalOpen,
        setIsModalOpen,
        handleInputChange,
        handleOptionsChange,
        handleDateChange,
        handleAddTeamMember,
        handleToggleAdmin,
        handleDeleteMember,
        errors,
        setErrors
        }}>
        {children}
        </ProjectContext.Provider>
    );
};

ProjectProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export const useProjectContext = () => useContext(ProjectContext);

export { ProjectContext };
