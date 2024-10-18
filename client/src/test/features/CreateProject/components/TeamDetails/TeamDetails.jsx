import { useState, useContext, useCallback } from 'react'
import PropTypes from 'prop-types'
import { NewTeamMemberTile, TeamMember } from '../NewTeamMemberTile/NewTeamMemberTile'
import TeamMemberInfo from '../TeamMemberInfo/TeamMemberInfo'
import { ProjectContext } from '../../ProjectContext'
import { WarningIcon } from "../../../../assets/icons"
import "./styles/TeamDetails.css"

const TeamDetails = ({ onAddTeamMember }) => {
    const [displayedMemberId, setDisplayedMemberId] = useState(null)
    const { projectData } = useContext(ProjectContext)
    const [, forceUpdate] = useState()

    const handleMemberTileClick = useCallback((memberId) => {
        setDisplayedMemberId(memberId)
        forceUpdate({})  // Force a re-render when switching members
    }, [])

    const displayedMember = projectData.team.find(member => member.id === displayedMemberId)

    return (
        <div className="new-project-team">
            <div className="new-project-team-title">
                <h3>Select Team Members</h3>
            </div>
            <div className="new-project-team-container">
                <div className="new-project-team-tile-container">
                    {projectData.team.map((member) => (
                        <TeamMember
                            key={member.id}
                            member={member}
                            clickMember={() => handleMemberTileClick(member.id)}
                        />
                    ))}
                    <NewTeamMemberTile onAddTeamMember={onAddTeamMember} />
                </div>
                <div className="new-project-team-member-information">
                {projectData.team.length < 2 && <div className="team-warning"><WarningIcon />You have not added anyone to your team</div>}
                    {displayedMember && (
                        <TeamMemberInfo
                            key={`${displayedMember.id}-${displayedMember.admin}`}
                            member={displayedMember}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

TeamDetails.propTypes = {
    onAddTeamMember: PropTypes.func.isRequired
}

export default TeamDetails
