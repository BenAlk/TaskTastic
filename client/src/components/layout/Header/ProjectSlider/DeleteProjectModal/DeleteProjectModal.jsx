import PropTypes from 'prop-types'
import { useState, useEffect, useRef } from 'react'
import { useTaskContext } from '../../../../../context/TaskContext'
import Modal from "../../../../common/Modal/Modal"
import styles from './DeleteProjectModal.module.css'

const DeleteProjectModal = ({ isOpen, onClose, onConfirm, projectId, projectName }) => {
    const [isChecking, setIsChecking] = useState(false)
    const [associatedTasks, setAssociatedTasks] = useState([])
    const { fetchTasks, tasks } = useTaskContext()
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [checkComplete, setCheckComplete] = useState(false)
    const hasCheckedRef = useRef(false)

    useEffect(() => {
        if (isOpen) {
            setIsChecking(false)
            setShowConfirmation(false)
            setAssociatedTasks([])
            setCheckComplete(false)
            hasCheckedRef.current = false
        }
    }, [isOpen])

    useEffect(() => {
        const checkForTasks = async () => {
            if (!isOpen || !projectId || hasCheckedRef.current) {
                return
            }

            setIsChecking(true)
            setCheckComplete(false)

            try {
                await fetchTasks(projectId)
                await new Promise(resolve => setTimeout(resolve, 300))

                setAssociatedTasks(tasks)
                setShowConfirmation(true)
            } catch (error) {
                console.error('Error:', error)
            } finally {
                setIsChecking(false)
                setCheckComplete(true)
                hasCheckedRef.current = true
            }
        }

        checkForTasks();                                // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, projectId, tasks])

    const handleConfirmDelete = async () => {
        await onConfirm()
        onClose()
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={showConfirmation ? "Confirm Project Deletion" : "Delete Project"}
            width="400px"
        >
            {!checkComplete ? (
                <div className={styles['checking-content']}>
                    <p>Checking for associated tasks...</p>
                </div>
            ) : showConfirmation ? (
                <div className={styles['confirmation-content']}>
                    <p>Are you sure you want to delete this project?</p>

                    <div className={styles['confirmation-details']}>
                        <p>Project Name: {projectName}</p>
                        {associatedTasks.length > 0 && (
                            <>
                                <p className={styles['warning']}>
                                    Warning: This project has {associatedTasks.length} active
                                    {associatedTasks.length === 1 ? ' task' : ' tasks'}.
                                </p>
                                <p>All associated tasks will be permanently deleted.</p>
                            </>
                        )}
                        <p className={styles['no-recovery']}>
                            This action cannot be undone.
                        </p>
                    </div>

                    <div className={styles['button-group']}>
                        <div
                            className={styles['cancel-button']}
                            onClick={onClose}
                        >
                            Cancel
                        </div>
                        <div
                            className={styles['delete-button']}
                            onClick={handleConfirmDelete}
                        >
                            Delete Project
                        </div>
                    </div>
                </div>
            ) : null}
        </Modal>
    )
}

DeleteProjectModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    projectId: PropTypes.string,
    projectName: PropTypes.string
}

export default DeleteProjectModal
