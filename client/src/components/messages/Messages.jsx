import { useState } from 'react';
import { useProjectContext } from '../../context/ProjectContext';
import QuickBoard from './QuickBoard/QuickBoard';
import DirectMessages from './DirectMessages/DirectMessages';
import styles from './Messages.module.css';

const Messages = () => {
    const [activeTab, setActiveTab] = useState('quickboard');
    const { currentProject } = useProjectContext();

    if (!currentProject) {
        return (
            <div className={styles['messages-container']}>
                <div className={styles['messages-header-container']}>
                    <h2>Message Center</h2>
                    <p className={styles["features-soon"]}>More features coming soon!</p>
                </div>
                <div className={styles['messages-content-container']}>
                    <div className={styles['select-a-project']}>
                        Please select a project to view messages.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles['messages-container']}>
            <div className={styles['messages-header-container']}>
                <h2>Message Center</h2>
                <p className={styles["features-soon"]}>More features coming soon!</p>
            </div>
            <div className={styles['messages-content-container']}>
                <div className={styles['message-type-header-container']}>
                    <h3
                        className={`${styles['message-type-header']} ${activeTab === 'quickboard' ? styles['selected'] : ''}`}
                        onClick={() => setActiveTab('quickboard')}
                    >
                        QuickBoard
                    </h3>
                    <h3
                        className={`${styles['message-type-header']} ${activeTab === 'direct' ? styles['selected'] : ''}`}
                        onClick={() => setActiveTab('direct')}
                    >
                        Direct Messages
                    </h3>
                </div>
                <div className={styles['message-content-main']}>
                    {activeTab === 'quickboard' ? (
                        <QuickBoard />
                    ) : (
                        <DirectMessages />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Messages;
