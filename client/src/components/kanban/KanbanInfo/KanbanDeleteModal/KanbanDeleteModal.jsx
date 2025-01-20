import PropTypes from 'prop-types'
import Modal from '../../../common/Modal/Modal'
import styles from './KanbanDeleteModal.module.css'

const KanbanDeleteModal = ({ isOpen, onClose, columnName, onConfirm }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Confirm Column Deletion"
        >
            <div className={styles['confirmation-content']}>
                <p>Are you sure you want to delete this column?</p>
                <div className={styles['confirmation-details']}>
                    <p><strong>Column Name:</strong> {columnName}</p>
                </div>
                <div className={styles['button-group']}>
                    <div
                        className={styles['cancel-button']}
                        onClick={onClose}
                    >
                        Cancel
                    </div>
                    <div
                        className={`${styles['delete-button']}`}
                        onClick={onConfirm}
                    >
                        Delete Column
                    </div>
                </div>
            </div>
        </Modal>
    )
}

KanbanDeleteModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    columnName: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired
}

export default KanbanDeleteModal
