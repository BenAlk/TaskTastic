import PropTypes from "prop-types"
import "./styles/KanbanVisualColumn.css"
import { getContrastTextColor } from "../../utils/getContrastTextColor";
import { TrashIcon } from "../../../../assets/icons";


const KanbanVisualColumn = ({ column, selectedColumnId, handleColumnClick, handleDeleteClick }) => {

    return (
        <div
        className={`kanban-board-visual-column ${selectedColumnId === column.id ? "selected-kanban-config" : ""}`}
        key={column.id}
        onClick={() => handleColumnClick(column.id, column)}
        >
            <div className="kanban-board-visual-column-title"  style={{backgroundColor: column.headerColor}}>
                <h3 style={{color: getContrastTextColor(column.headerColor)}}>{column.columnName}</h3>
                {selectedColumnId === column.id && <div className="delete-kanban-column" title="Delete Column" onClick={(e) => handleDeleteClick(e,column.id)}> <TrashIcon /> </div>}
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
    )
}

KanbanVisualColumn.propTypes = {
    column: PropTypes.object.isRequired,
    selectedColumnId: PropTypes.string,
    handleColumnClick: PropTypes.func.isRequired,
    handleDeleteClick: PropTypes.func.isRequired
}

export default KanbanVisualColumn
