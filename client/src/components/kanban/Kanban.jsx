import { useState, useEffect } from 'react'
import styles from "./Kanban.module.css"
import KanbanInfo from './KanbanInfo/KanbanInfo'
import KanbanDisplay from './KanbanDisplay/KanbanDisplay'
import { useProjectContext } from "../../context/ProjectContext"
import { useProjectPermissions } from "../../hooks/useProjectPermissions"
import { EditIcon } from '../../assets/icons'

const Kanban = () => {
    const { currentProject } = useProjectContext()
    const { canEditKanbanBoard } = useProjectPermissions()
    const [selectedColumnId, setSelectedColumnId] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [draftKanban, setDraftKanban] = useState(null)

    const selectedColumn = draftKanban?.find(col => col._id === selectedColumnId) || null

    const DEFAULT_COLUMN = {
        name: "New Column",
        color: "#e2e8f0",
        maxDays: 0,
        maxTasks: 0,
    }

    const handleEditChange = () => {
        if (!canEditKanbanBoard()) {
            return
        }

        if (!isEditing) {
            setDraftKanban([...currentProject.kanbanColumns])
        } else {
            setDraftKanban(null)
            setSelectedColumnId(null)
        }
        setIsEditing(!isEditing)
    }

    const handleCreateFirstColumn = async () => {
        if (!canEditKanbanBoard()) {
            return
        }

        try {
            const newColumn = {
                ...DEFAULT_COLUMN,
                _id: `draft_${Date.now()}`,
                order: 0
            }

            setDraftKanban([newColumn])
            setIsEditing(true)
            setSelectedColumnId(newColumn._id)
        } catch (error) {
            console.error('Error creating first kanban column:', error)
        }
    }

    useEffect(() => {
        setIsEditing(false)
        setDraftKanban(null)
        setSelectedColumnId(null)
    }, [currentProject?._id])

    if (!currentProject) {
        return (
            <div className={styles['kanban-container']}>
                <div className={styles['kanban-header-container']}>
                    <h2>Kanban</h2>
                </div>
                <div className={styles['no-kanban-content-container']}>
                    <h2 className={styles['no-data-message']}>Choose a project above to view the Kanban.</h2>
                </div>
            </div>
        )
    }

    if (currentProject?.kanbanColumns?.length === 0 && !draftKanban?.length) {
        return (
            <div className={styles['kanban-container']}>
                <div className={styles['kanban-header-container']}>
                    <h2>Kanban</h2>
                </div>
                <div className={styles['no-kanban-content-container']}>
                    <h2 className={styles['no-data-message']}>This project has no Kanban columns.</h2>
                    {canEditKanbanBoard() && (
                        <div
                            className={styles['create-default-button']}
                            onClick={handleCreateFirstColumn}
                            title="Add your first column"
                        >
                            Add First Column
                        </div>
                    )}
                </div>
            </div>
        )
    }

    return (
        <div className={styles['kanban-container']}>
            <div className={styles['kanban-header-container']}>
                <h2>Kanban</h2>
            </div>
            <div className={styles['kanban-content-container']}>
                {isEditing && (
                    <div className={styles['kanban-info-container']}>
                        <div className={styles['kanban-info-header-container']}>
                            <h3>Column Info</h3>
                        </div>
                        <div className={styles['kanban-info-content-container']}>
                            <KanbanInfo
                                selectedColumn={selectedColumn}
                                setSelectedColumn={setSelectedColumnId}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                                setDraftKanban={setDraftKanban}
                                defaultColumn={DEFAULT_COLUMN}
                                onUpdateColumn={(updatedData) => {
                                    if (Array.isArray(updatedData)) {
                                        setDraftKanban(updatedData);
                                    } else {
                                        setDraftKanban(prev =>
                                            prev.map(col =>
                                                col._id === updatedData._id ? updatedData : col
                                            )
                                        );
                                    }
                                }}
                                draftKanban={draftKanban}
                            />
                        </div>
                    </div>
                )}
                <div className={styles['kanban-display-container']}>
                    <div className={`${styles['kanban-display-header-container']} ${!isEditing ? styles['kanban-display-header-container-editing'] : ''}`}>
                        <h3>Kanban Visual</h3>
                        {canEditKanbanBoard() && (
                            <div className={styles['kanban-controls']}>
                                <div
                                    className={styles['edit-task-button']}
                                    title={"Edit Kanban"}
                                    onClick={handleEditChange}
                                >
                                    <EditIcon
                                        height={"1.25rem"}
                                        width={"1.25rem"}
                                        className={styles['icon']}
                                        title={"Edit Selected Column"}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={`${styles['kanban-display-content-container']} ${!isEditing ? styles['kanban-display-content-container-editing'] : ''}`}>
                        <KanbanDisplay
                            selectedColumn={selectedColumnId}
                            setSelectedColumn={setSelectedColumnId}
                            currentProject={{
                                ...currentProject,
                                kanbanColumns: isEditing ? draftKanban : currentProject.kanbanColumns
                            }}
                            isEditing={isEditing}
                            setDraftKanban={setDraftKanban}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Kanban
