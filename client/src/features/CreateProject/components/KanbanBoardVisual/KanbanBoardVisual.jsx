import { useContext } from "react"
import PropTypes from "prop-types"
import "./styles/KanbanBoardVisual.css"
import KanbanVisualColumn from "../KanbanVisualColumn/KanbanVisualColumn";
import { LayoutContext } from "../../../../pages/Layout/index"

const KanbanBoardVisual = ({
    setActiveTab,
    kanbanColumns,
    selectedColumnId,
    setSelectedColumnId,
    setActiveColumn,
}) => {

    const { errors } = useContext(LayoutContext);

    const handleColumnClick = (columnId, column) => {
        setSelectedColumnId(columnId);
        setActiveTab('adjust');
        setActiveColumn(column);
    };

    return (
        <div className="new-project-kanban-board-visual">
            <div className={`kanban-board-visual-container`}>
                {kanbanColumns.map((column, index) => (
                    <KanbanVisualColumn
                        key={column.id}
                        column={column}
                        selectedColumnId={selectedColumnId}
                        handleColumnClick={handleColumnClick}
                        index={index}
                        kanbanColumns={kanbanColumns}
                    />
                ))}
            </div>
            {errors.kanban && <p className="kanban-board-visual-error">{errors.kanban}</p>}
        </div>
    )
}

KanbanBoardVisual.propTypes = {
    setActiveTab: PropTypes.func.isRequired,
    kanbanColumns: PropTypes.array.isRequired,
    selectedColumnId: PropTypes.string,
    setSelectedColumnId: PropTypes.func.isRequired,
    setActiveColumn: PropTypes.func,
}

export default KanbanBoardVisual
