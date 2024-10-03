import { useState, useContext } from 'react';
import "./styles/KanbanDetails.css";
import KanbanConfigOptions from '../KanbanConfigOptions/KanbanConfigOptions';
import KanbanBoardVisual from '../KanbanBoardVisual/KanbanBoardVisual';
import { ProjectContext } from '../../ProjectContext';

const generateRandomId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

const KanbanDetails = () => {
    const { projectData } = useContext(ProjectContext);
    const [activeTab, setActiveTab] = useState('add');
    const [newColumn, setNewColumn] = useState({
        id: `${generateRandomId()}`,
        name: '',
        headerColor: '#000000',
        maxDays: '',
        maxTasks: ''
    });
    const [selectedColumnId, setSelectedColumnId] = useState(null);

    const handleSelectedColumn = (columnId) => {
        setSelectedColumnId(columnId);
    };

    const handleColumnInputChange = (e) => {
        const { name, value } = e.target;
        setNewColumn({ ...newColumn, [name]: value });
    };

    const handleAddColumn = () => {
        projectData.kanban.push(newColumn);
        setNewColumn({ id: `${generateRandomId()}`, name: '', headerColor: '#000000', maxDays: '', maxTasks: '' });
    };

    return (
        <div className="new-project-kanban">
            <div className="new-project-kanban-title">
                <h3>Kanban Board</h3>
            </div>
            <div className="new-project-kanban-board-container">
                <KanbanConfigOptions activeTab={activeTab} setActiveTab={setActiveTab} newColumn={newColumn} handleColumnInputChange={handleColumnInputChange} handleAddColumn={handleAddColumn} setSelectedColumnId={setSelectedColumnId} />
                <KanbanBoardVisual kanbanData={projectData.kanban} setActiveTab={setActiveTab} selectedColumn={selectedColumnId} handleSelectedColumn={handleSelectedColumn} />
            </div>
        </div>
    )
}

export default KanbanDetails;
