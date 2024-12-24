import { useEffect } from 'react'
import styles from './Team.module.css'
import TeamMemberTile from './TeamMemberTile/TeamMemberTile'
import NewTeamMemberTile from './NewTeamMemberTile/NewTeamMemberTile'
import { useProjectContext } from '../../context/ProjectContext'
import { useUserContext } from '../../context/UserContext'

const Team = () => {
    const { currentProject } = useProjectContext()
    const { getMultipleUsers } = useUserContext()

    useEffect(() => {
        if (currentProject?.team) {
            const userIds = currentProject.team.map(member => member.user)
            getMultipleUsers(userIds)
        }
    }, [currentProject?.team, getMultipleUsers])

    if (!currentProject) {
        return (
            <div className={styles['team-container']}>
                <div className={styles['team-header-container']}>
                    <h2>Team Members</h2>
                </div>
                <div className={styles['team-content-container']}>
                    <div className={styles['select-a-project']}>
                        Please select a project to view team members.
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles['team-container']}>
            <div className={styles['team-header-container']}>
                <h2>Team Members</h2>
            </div>
            <div className={styles['team-content-container']}>
                {currentProject.team.map(member => (
                    <TeamMemberTile
                        key={member.user}
                        member={member}
                    />
                ))}
                <NewTeamMemberTile />
            </div>
        </div>
    );
};

export default Team;
