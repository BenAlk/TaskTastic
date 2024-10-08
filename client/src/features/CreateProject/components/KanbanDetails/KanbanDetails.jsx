import { useState, useContext } from 'react';
import "./styles/KanbanDetails.css";
import KanbanConfigOptions from '../KanbanConfigOptions/KanbanConfigOptions';
import KanbanBoardVisual from '../KanbanBoardVisual/KanbanBoardVisual';
import { ProjectContext } from '../../ProjectContext';
import { moveItemUp, moveItemDown } from '../../utils/changeKanbanColumnOrder';
import { LayoutContext } from "../../../../pages/Layout/index"

const KanbanDetails = () => {
    const { setErrors } = useContext(LayoutContext);
    const {projectData, setProjectData} = useContext(ProjectContext);
    const [kanbanColumns, setKanbanColumns] = useState(projectData.kanban || []);
    const [activeTab, setActiveTab] = useState('add');
    const [selectedColumnId, setSelectedColumnId] = useState(null);
    const [activeColumn, setActiveColumn] = useState(null);

    const handleAddColumn = (newColumn) => {
        setKanbanColumns(prevColumns => [...prevColumns, newColumn]);
    };

    const handleUpdateColumn = (updatedColumn) => {
        setKanbanColumns(prevColumns =>
            prevColumns.map(column =>
                column.id === updatedColumn.id ? updatedColumn : column
            )
        )
    }
    const handleMoveColumn = (direction) => {
        const index = kanbanColumns.findIndex(column => column.id === selectedColumnId);
        setKanbanColumns(prevColumns =>
            direction === 'up'
                ? moveItemUp([...prevColumns], index)
                : moveItemDown([...prevColumns], index)
        );
    };

    const handleConfirmKanbanSetup = () => {
        if (kanbanColumns.length < 2) {
            setErrors(prev => ({
                ...prev, kanban: 'Please add at least two kanban columns.'
            }))
        } else if (kanbanColumns.length >= 1) {
        setProjectData(prevData => ({
            ...prevData,
            kanban: kanbanColumns
        }));
        setActiveTab('add');
        setActiveColumn(null);
        setSelectedColumnId(null);
    };
}

    return (
        <div className="new-project-kanban">
            <div className="new-project-kanban-title">
                <h3>Kanban Board</h3>
            </div>
            <div className="new-project-kanban-board-container">
                <KanbanConfigOptions
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    handleAddColumn={handleAddColumn}
                    handleUpdateColumn={handleUpdateColumn}
                    selectedColumnId={selectedColumnId}
                    setSelectedColumnId={setSelectedColumnId}
                    kanbanColumns={kanbanColumns}
                    activeColumn={activeColumn}
                    setActiveColumn={setActiveColumn}
                    handleMoveColumn={handleMoveColumn}
                />
                <KanbanBoardVisual
                    kanbanColumns={kanbanColumns}
                    setActiveTab={setActiveTab}
                    selectedColumnId={selectedColumnId}
                    setSelectedColumnId={setSelectedColumnId}
                    activeColumn={activeColumn}
                    setActiveColumn={setActiveColumn}
                />
                <div className="confirm-kanban-setup">
                    <div className="confirm-kanban-setup-button"  onClick={handleConfirmKanbanSetup}>Confirm Kanban</div>
                </div>
            </div>
        </div>
    )
}

export default KanbanDetails;
