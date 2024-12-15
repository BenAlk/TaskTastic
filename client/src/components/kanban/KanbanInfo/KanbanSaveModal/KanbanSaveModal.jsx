import PropTypes from 'prop-types';
import Modal from '../../../common/Modal/Modal';
import styles from './KanbanSaveModal.module.css';

const KanbanSaveModal = ({ isOpen, onClose, changes, onConfirm }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Confirm Kanban Changes"
        >
            <div className={styles['confirmation-content']}>
                <p>Please review the following changes to your Kanban board:</p>
                <div className={styles['confirmation-details']}>
                    {changes.map((change, index) => (
                        <div key={index} className={styles['change-group']}>
                            <h4>{change.columnName}</h4>
                            {Object.entries(change.changes).map(([field, value]) => (
                                <div key={field} className={styles['change-item']}>
                                    <span className={styles['field-name']}>{field}: </span>
                                    <span className={styles['old-value']}>{value.from}</span>
                                    <span className={styles['arrow']}> → </span>
                                    <span className={styles['new-value']}>{value.to}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className={styles['button-group']}>
                    <div
                        className={styles['cancel-button']}
                        onClick={onClose}
                    >
                        Back to Edit
                    </div>
                    <div
                        className={styles['save-button']}
                        onClick={onConfirm}
                    >
                        Save Changes
                    </div>
                </div>
            </div>
        </Modal>
    );
};

KanbanSaveModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    changes: PropTypes.arrayOf(PropTypes.shape({
        columnName: PropTypes.string.isRequired,
        changes: PropTypes.object.isRequired
    })).isRequired,
    onConfirm: PropTypes.func.isRequired
};

export default KanbanSaveModal;
