import PropTypes from 'prop-types'
import ChoiceSelector from '../ChoiceSelector/ChoiceSelector'
import "./styles/TeamMemberInfo.css"

const TeamMemberInfo = ({member}) => {
    return (
        <div className="team-member-info">
            <h4>{member.name}</h4>
            <p>ID: {member.id}</p>
            <p>Role: {member.role}</p>
            <p>Email: {member.email}</p>
            <p>Color: <span style={{ backgroundColor: `#${member.color}`, padding: '2px 10px', color: 'white' }}>#{member.color}</span></p>
            {member.pending ? <ChoiceSelector order={true} id={member.id} initialChecked={true} disabled={true}>Pending</ChoiceSelector> : null}
            <p>Admin: {member.admin ? 'Yes' : 'No'}</p>
        </div>
    )
}

TeamMemberInfo.propTypes = {
    member: PropTypes.object.isRequired
}

export default TeamMemberInfo
