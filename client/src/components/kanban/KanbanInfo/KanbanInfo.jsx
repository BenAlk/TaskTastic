import PropTypes from 'prop-types';
import styles from './KanbanInfo.module.css';
import { useState } from 'react'
import KanbanSaveModal from "./KanbanSaveModal/KanbanSaveModal"
import KanbanDeleteModal from './KanbanDeleteModal/KanbanDeleteModal';
import { useProjectContext } from "./../../../context/ProjectContext"

const KanbanInfo = ({selectedColumn, setSelectedColumn, isEditing, setIsEditing, setDraftKanban, onUpdateColumn, draftKanban, defaultColumn}) => {
    const [showSaveModal, setShowSaveModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { updateKanbanColumns, currentProject } = useProjectContext()
    const columnName = selectedColumn?.name || '';

    const getColumnChanges = (original, draft) => {
        if (!selectedColumn || !selectedColumn._id) {
            return [];
        }

        if (!original || !draft) return [];

        const changes = []

        const draftCol = draft.find(col => col._id === selectedColumn._id)
        if (!draftCol) return []

        if (draftCol._id.startsWith('draft_')) {
            changes.push({
                columnName: draftCol.name,
                changes: {
                    status: {
                        from: 'New Column',
                        to: 'Will be created'
                    },
                    name: {
                        from: 'New Column',
                        to: draftCol.name
                    },
                    maxDays: {
                        from: 0,
                        to: draftCol.maxDays
                    },
                    maxTasks: {
                        from: 0,
                        to: draftCol.maxTasks
                    },
                    color: {
                        from: '#e2e8f0',
                        to: draftCol.color
                    },
                    order: {
                        from: 'Last',
                        to: draftCol.order + 1
                    }
                }
            });
            return changes;
        }


        const originalCol = original.find(col => col._id === selectedColumn._id)
        if(!originalCol || !draftCol) return []

        const differences = {};

        if (draftCol.name !== originalCol.name) {
            differences.name = {
                from: originalCol.name,
                to: draftCol.name
            };
        }
        if (draftCol.maxDays !== originalCol.maxDays) {
            differences.maxDays = {
                from: originalCol.maxDays,
                to: draftCol.maxDays
            };
        }
        if (draftCol.maxTasks !== originalCol.maxTasks) {
            differences.maxTasks = {
                from: originalCol.maxTasks,
                to: draftCol.maxTasks
            };
        }
        if (draftCol.color !== originalCol.color) {
            differences.color = {
                from: originalCol.color,
                to: draftCol.color
            };
        }
        if (draftCol.order !== originalCol.order) {
            differences.order = {
                from: originalCol.order + 1,
                to: draftCol.order + 1
            };
        }

        if (Object.keys(differences).length > 0) {
            changes.push({
                columnName: originalCol.name,
                changes: differences
            });
        }

        return changes;
    };

    const handleInputChange = (field, value) => {
        if (isEditing && selectedColumn) {
            onUpdateColumn({
                ...selectedColumn,
                [field]: value
            })
        }
    }

    const handleOrderChange = (direction) => {
        if (!isEditing || !selectedColumn) return;

        const currentOrder = selectedColumn.order;
        const newOrder = direction === 'left' ? currentOrder - 1 : currentOrder + 1;

        if (newOrder < 0 || newOrder >= draftKanban.length) return;

        const updatedColumns = draftKanban.map(column => {
            if (column._id === selectedColumn._id) {
                return { ...column, order: newOrder };
            }
            if (column.order === newOrder) {
                return { ...column, order: currentOrder };
            }
            return column;
        });

        onUpdateColumn(updatedColumns);
    };

    const handleSaveClick = () => {
        if (!isEditing) return;

        // Add this check
        if (!selectedColumn) {
            // You might want to show a user-friendly message here
            console.log('Please select a column to save changes');
            return;
        }

        const changes = getColumnChanges(currentProject.kanbanColumns, draftKanban);
        if (changes.length === 0) {
            setIsEditing(false);
            setDraftKanban(null);
            return;
        }
        setShowSaveModal(true);
    };

    const handleConfirmSave = async () => {
        try {
            const columnsToSave = draftKanban.map(column => {
                if (column._id.startsWith('draft_')) {
                    const { _id, ...columnWithoutId } = column;
                    return columnWithoutId;
                }
                return column;
            });

            await updateKanbanColumns(columnsToSave);
            setShowSaveModal(false);
            setIsEditing(false);
            setDraftKanban(null);
            setSelectedColumn(null);
        } catch (error) {
            console.error('Error saving kanban columns:', error);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        setDraftKanban(null);
    };

    const handleReset = () => {
        if (isEditing && selectedColumn) {
            setDraftKanban(currentProject.kanbanColumns);
        }
    };

    const handleDeleteClick = () => {
        if (!selectedColumn) return;
        setShowDeleteModal(true);
    };

    const handleAddClick = () => {
        if (isEditing && draftKanban) {
            const newColumn = {
                ...defaultColumn,
                _id: `draft_${Date.now()}`,
                order: draftKanban.length
            };
            setDraftKanban([...draftKanban, newColumn]);
            setSelectedColumn(newColumn._id);
        }
    }

    const handleConfirmDelete = async () => {
        if (!selectedColumn || !draftKanban) return;

        try {
            const updatedColumns = draftKanban.filter(col => col._id !== selectedColumn._id);

            const reorderedColumns = updatedColumns.map((col, index) => ({
                ...col,
                order: index
            }));

            setDraftKanban(reorderedColumns)
            setSelectedColumn(null)
            setShowDeleteModal(false);

        } catch (error) {
            console.error('Error deleting kanban column:', error);
        }
    };


    return (
        <>
        <div className={styles['kanban-info-wrapper']}>
            <div className={styles['column-intro']}>
                <p>Select a column to edit its details, or click below to add new column.</p>
                <div className={styles['kanban-column-add']} onClick={handleAddClick}>
                    + Add Column
                </div>
            </div>
            <div className={styles['info-group']}>
                <div className={styles['info-group-title']}>
                    <h4>Column Title</h4>
                </div>
                <div className={styles['info-group-content']}>
                    {isEditing ? (
                        <input
                            type="text"
                            value={columnName}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                        />
                    ) : (
                    <div className={styles['column-data']}>{selectedColumn.name}</div>
                    )}
                </div>
            </div>
            <div className={styles['info-group']}>
                <div className={styles['info-group-title']}>
                    <h4>Column Order</h4>
                </div>
                <div className={styles['info-group-content']}>
                    <div
                        className={`${styles['order-selector']} ${(!isEditing || selectedColumn?.order === 0 || !selectedColumn) ? styles['disabled'] : ''}`}
                        onClick={() => handleOrderChange('left')}
                    >
                        Left
                    </div>
                    <div
                        className={`${styles['order-selector']} ${(!isEditing || selectedColumn?.order === draftKanban.length - 1 || !selectedColumn) ? styles['disabled'] : ''}`}
                        onClick={() => handleOrderChange('right')}
                    >
                        Right
                    </div>
                </div>
            </div>
            <div className={styles['info-group']} title={"Maximum number of days that a task can be in this column, before a flag for attention."}>
                <div className={styles['info-group-title']}>
                    <h4>Maximum Days</h4>
                </div>
                <div className={styles['info-group-content']}>
                    {isEditing ?
                    <input
                        className={styles['input-number']}
                        type="number"
                        value={selectedColumn?.maxDays || 0}
                        onChange={(e) => handleInputChange('maxDays', parseInt(e.target.value))}
                    /> :
                    <div className={styles['column-data']}>{selectedColumn.maxDays}</div>
                    }
                </div>
            </div>
            <div className={styles['info-group']} title={"Maximum number of tasks that can be in this column, before a flag for attention."}>
                <div className={styles['info-group-title']}>
                    <h4>Maximum Tasks</h4>
                </div>
                    <div className={styles['info-group-content']}>
                    {isEditing ?
                    <input
                        className={styles['input-number']}
                        type="number"
                        value={selectedColumn?.maxTasks || 0}
                        onChange={(e) => handleInputChange('maxTasks', parseInt(e.target.value))}
                    /> :
                    <div className={styles['column-data']}>{selectedColumn?.maxTasks ?? ''}</div>}
                </div>
            </div>
            <div className={styles['info-group']}>
                <div className={styles['info-group-title']}>
                    <h4>Custom Colour</h4>
                </div>
                <div className={styles['info-group-content']}>
                    <input
                        type="color"
                        value={selectedColumn?.color || '#e2e8f0'}
                        className={styles['color-input']}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        disabled={!isEditing}
                        />
                </div>
            </div>
            <div className={styles['kanban-column-buttons']}>
                <div
                className={`${styles['kanban-column-save']} ${!isEditing ? styles['disabled'] : ''}`}
                onClick={handleSaveClick}
                title={isEditing ? "Save Changes" : ""}
                >
                    SAVE
                </div>
                <div className={`${styles['kanban-column-reset']} ${!isEditing ? styles['disabled'] : ''}`}
                onClick={handleReset}
                title={isEditing ? "Reset Changes" : ""}
                >
                    RESET
                </div>
                <div className={`${styles['kanban-column-cancel']} ${!isEditing ? styles['disabled'] : ''}`}
                onClick={handleCancel}
                title={isEditing ? "Cancel Changes" : ""}
                >
                    CANCEL
                </div>
                <div className={`${styles['kanban-column-delete']} ${!isEditing ? styles['disabled'] : ''}`}
                onClick={handleDeleteClick}
                title={isEditing ? "Delete Column" : ""}
                >
                    DELETE
                </div>
            </div>
        </div>

        <KanbanSaveModal
            isOpen={showSaveModal}
            onClose={() => setShowSaveModal(false)}
            changes={selectedColumn ? getColumnChanges(currentProject.kanbanColumns, draftKanban) : []}
            onConfirm={handleConfirmSave}
        />
        <KanbanDeleteModal
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            columnName={selectedColumn?.name ?? ''}
            // taskCount={selectedColumn?.tasks?.length || 0}
            onConfirm={handleConfirmDelete}
        />
    </>
    )
}

KanbanInfo.propTypes = {
    selectedColumn: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        color: PropTypes.string,
        maxDays: PropTypes.number,
        maxTasks: PropTypes.number,
        order: PropTypes.number
    }),
    setSelectedColumn: PropTypes.func.isRequired,
    isEditing: PropTypes.bool.isRequired,
    setIsEditing: PropTypes.func.isRequired,
    setDraftKanban: PropTypes.func.isRequired,
    onUpdateColumn: PropTypes.func.isRequired,
    draftKanban: PropTypes.arrayOf(
        PropTypes.shape({
            _id: PropTypes.string,
            name: PropTypes.string.isRequired,
            color: PropTypes.string.isRequired,
            maxDays: PropTypes.number.isRequired,
            maxTasks: PropTypes.number.isRequired,
            order: PropTypes.number.isRequired,
        })
    ),
    defaultColumn: PropTypes.shape({
        name: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        maxDays: PropTypes.number.isRequired,
        maxTasks: PropTypes.number.isRequired,
        order: PropTypes.number,
    })
};

export default KanbanInfo;
