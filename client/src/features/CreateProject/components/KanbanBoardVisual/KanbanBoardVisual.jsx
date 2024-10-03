import PropTypes from "prop-types"
import "./styles/KanbanBoardVisual.css"

const   KanbanBoardVisual = ({setActiveTab, kanbanData, selectedColumn, handleSelectedColumn}) => {
    console.log(kanbanData)

    const handleColumnClick = (columnId) => {
        handleSelectedColumn(columnId);
        setActiveTab('adjust');
    };

    return (
        <div className="new-project-kanban-board-visual">
            <div className="kanban-board-visual-container">
                {kanbanData?.map((column, index) => (
                <div className={`kanban-board-visual-column ${selectedColumn === column.id ? "selected-kanban-config" : ""}`} key={index} onClick={() => handleColumnClick(column.id)}>
                    <div className="kanban-board-visual-column-title" style={{backgroundColor: column.headerColor}}>
                        <h3>{column.name}</h3>
                    </div>
                    <div className="kanban-board-visual-column-content">
                        <div className="kanban-board-visual-column-content-card">
                            card1
                        </div>
                        <div className="kanban-board-visual-column-content-card">
                            card2
                        </div>
                    </div>
                </div>
                ))}
            </div>
        </div>
    )
}

KanbanBoardVisual.propTypes = {
    setActiveTab: PropTypes.func.isRequired,
    kanbanData: PropTypes.array.isRequired,
    selectedColumn: PropTypes.string,
    handleSelectedColumn: PropTypes.func.isRequired
}


export default KanbanBoardVisual
