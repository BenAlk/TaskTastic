import { useState } from 'react'
import PropTypes from 'prop-types'
import { NewTeamMemberTile, TeamMember } from '../NewTeamMemberTile/NewTeamMemberTile'
import TeamMemberInfo from '../TeamMemberInfo/TeamMemberInfo'
import "./styles/TeamDetails.css"

const TeamDetails = ({ team, onAddTeamMember }) => {
    const [displayedMember, setDisplayedMember] = useState(null)

    const handleMemberTileClick = (member) => {
        setDisplayedMember(member)
    }

    return (
        <div className="new-project-team">
            <div className="new-project-team-title">
                <h3>Select Team Members</h3>
            </div>
            <div className="new-project-team-container">
                <div className="new-project-team-tile-container">
                    {team.map((member, index) => (
                        <TeamMember
                            key={index}
                            member={member}
                            clickMember={() => handleMemberTileClick(member)}
                        />
                    ))}
                    <NewTeamMemberTile onAddTeamMember={onAddTeamMember} />
                </div>
                <div className="new-project-team-member-information">
                    {displayedMember && <TeamMemberInfo member={displayedMember} />}
                </div>
            </div>
        </div>
    )
}

TeamDetails.propTypes = {
    team: PropTypes.array.isRequired,
    onAddTeamMember: PropTypes.func.isRequired
}

export default TeamDetails
