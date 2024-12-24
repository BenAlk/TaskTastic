import { useState } from 'react';
import styles from './NewTeamMemberTile.module.css';
import AddTeamMemberModal from '../AddTeamMemberModal/AddTeamMemberModal';

const NewTeamMemberTile = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div
                className={styles['new-member-tile-container']}
                onClick={() => setIsModalOpen(true)}
            >
                <div className={styles['new-member-tile-header']}>
                    <h2>Add Team Member</h2>
                </div>
                <div className={styles['new-member-tile-content']}>
                    <div className={styles['new-member-icon']}>
                        +
                    </div>
                </div>
            </div>
            <AddTeamMemberModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};

export default NewTeamMemberTile;
