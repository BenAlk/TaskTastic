import PropTypes from "prop-types"
import ChooseColumnHeaderColor from '../ChooseColumnHeaderColor/ChooseColumnHeaderColor'
import "./styles/KanbanConfigOptions.css"

const KanbanConfigOptions = ({activeTab, setActiveTab, newColumn, handleColumnInputChange, handleAddColumn, setSelectedColumnId}) => {

    const handleAddColumnClick = () => {
        setSelectedColumnId(null);
        setActiveTab('add');
    }

    return (
        <div className="new-project-kanban-options">
                    <div className="new-project-kanban-options-tabs">
                        <div
                            className={`new-project-kanban-add-column column-tab ${activeTab === 'add' ? 'active-tab' : ''}`}
                            onClick={() => handleAddColumnClick()}
                        >
                            Add Column
                        </div>
                        <div
                            className={`new-project-kanban-adjust-column column-tab ${activeTab === 'adjust' ? 'active-tab' : ''}`}
                            onClick={() => setActiveTab('adjust')}
                        >
                            Adjust Column
                        </div>
                    </div>
                    {activeTab === 'add' && (
                        <div className="new-project-kanban-add-column-container">
                            <input
                                type="text"
                                name="name"
                                className="add-kanban-input"
                                placeholder="Column Name"
                                value={newColumn.name}
                                onChange={handleColumnInputChange}
                            />
                            <ChooseColumnHeaderColor
                                value={newColumn.headerColor}
                                onChange={handleColumnInputChange}
                            />
                            <div className="kanban-column-number-inputs">
                            <input
                                type="number"
                                name="maxDays"
                                className="add-kanban-input max-days"
                                placeholder="Max Days"
                                value={newColumn.maxDays}
                                onChange={handleColumnInputChange}
                            />
                            <input
                                type="number"
                                name="maxTasks"
                                className="add-kanban-max-tasks"
                                placeholder="Max Tasks"
                                value={newColumn.maxTasks}
                                onChange={handleColumnInputChange}
                            />
                            </div>
                            <div className="add-kanban-column-button" onClick={handleAddColumn}>Confirm Column</div>
                        </div>
                    )}
                    {activeTab === 'adjust' && (
                        <div className="new-project-kanban-adjust-column-container">
                            {/* Add content for adjusting columns here */}
                        </div>
                    )}
                </div>
    )
}

KanbanConfigOptions.propTypes = {
    activeTab: PropTypes.string.isRequired,
    setActiveTab: PropTypes.func.isRequired,
    newColumn: PropTypes.object.isRequired,
    handleColumnInputChange: PropTypes.func.isRequired,
    handleAddColumn: PropTypes.func.isRequired,
    setSelectedColumnId: PropTypes.func.isRequired
}

export default KanbanConfigOptions
