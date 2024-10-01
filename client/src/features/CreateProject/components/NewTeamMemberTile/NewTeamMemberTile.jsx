import { AddIcon } from '../../../../assets/icons'
import PropTypes from 'prop-types'

export const NewTeamMemberTile = ({onAddTeamMember}) => {

return (
    <div className="new-project-team-member-tile active-tile">
        <div  onClick={onAddTeamMember}>
        <AddIcon width="28px" height="28px" className="add-member-icon active-icon" />
        </div>
    </div>
    )
}

NewTeamMemberTile.propTypes = {
    onAddTeamMember: PropTypes.func
}

export const TeamMember = ({member, clickMember}) => {

    const teamMember = member
    console.log("Team member:", teamMember)
    return (
    <div className="new-project-team-member-tile added-tile" onClick={clickMember}>
        <img src={member.avatar} alt={`${member.name} avatar`} />
    </div>
    )
}

TeamMember.propTypes = {
    member: PropTypes.object,
    clickMember: PropTypes.func
}
