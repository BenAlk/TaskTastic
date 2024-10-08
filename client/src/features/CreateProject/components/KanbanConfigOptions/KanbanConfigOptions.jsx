import { useContext } from "react"
import PropTypes from "prop-types"
import "./styles/KanbanConfigOptions.css"
import AddKanbanConfig from "../AddKanbanConfig/AddKanbanConfig"
import AdjustKanbanColumnDetails from "../AdjustKanbanColumnDetails/AdjustKanbanColumnDetails"
import { LayoutContext } from "../../../../pages/Layout/index"

const KanbanConfigOptions = ({
    activeTab,
    setActiveTab,
    handleAddColumn,
    handleUpdateColumn,
    selectedColumnId,
    setSelectedColumnId,
    kanbanColumns,
    activeColumn,
    setActiveColumn,
    handleMoveColumn,
}) => {
    const { errors, setErrors } = useContext(LayoutContext);

    const handleAddColumnClick = () => {
        setSelectedColumnId(null);
        setActiveTab('add');
        setActiveColumn(null);
    }

    return (
        <div className="new-project-kanban-options">
            <div className="new-project-kanban-options-tabs">
                <div
                    className={`new-project-kanban-add-column column-tab ${activeTab === 'add' ? 'active-tab' : 'not-active'}`}
                    onClick={handleAddColumnClick}
                >
                    Add Column
                </div>
                <div
                    className={`new-project-kanban-adjust-column column-tab ${activeTab === 'adjust' ? 'active-tab' : 'not-active'}`}
                    onClick={() => setActiveTab('adjust')}
                >
                    Adjust Column
                </div>
            </div>
            {activeTab === 'add' &&
                <AddKanbanConfig handleAddColumn={handleAddColumn} errors={errors} setErrors={setErrors} />
            }
            {activeTab === 'adjust' && (
                <AdjustKanbanColumnDetails
                    selectedId={selectedColumnId}
                    kanbanColumns={kanbanColumns}
                    handleUpdateColumn={handleUpdateColumn}
                    setActiveTab={setActiveTab}
                    activeColumn={activeColumn}
                    setActiveColumn={setActiveColumn}
                    handleMoveColumn={handleMoveColumn}
                />
            )}
        </div>
    )
}

KanbanConfigOptions.propTypes = {
    activeTab: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired,
    handleAddColumn: PropTypes.func.isRequired,
    handleUpdateColumn: PropTypes.func.isRequired,
    selectedColumnId: PropTypes.string,
    setSelectedColumnId: PropTypes.func.isRequired,
    kanbanColumns: PropTypes.array.isRequired,
    activeColumn: PropTypes.object,
    setActiveColumn: PropTypes.func.isRequired,
    handleMoveColumn: PropTypes.func.isRequired,
}

export default KanbanConfigOptions
