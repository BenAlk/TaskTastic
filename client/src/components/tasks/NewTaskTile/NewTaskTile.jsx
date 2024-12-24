import { useState } from 'react'
import styles from './NewTaskTile.module.css'
import NewTaskModal from '../NewTaskModal/NewTaskModal'

const NewTaskTile = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div
                className={styles['new-task-tile-container']}
                onClick={() => setIsModalOpen(true)}
            >
                <div className={styles['new-task-tile-header']}>
                    <h2>Add New Task</h2>
                </div>
                <div className={styles['new-task-tile-content']}>
                    <div className={styles['new-task-icon']}>
                        +
                    </div>
                </div>
            </div>
            <NewTaskModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            />
        </>

    );
};

export default NewTaskTile;
