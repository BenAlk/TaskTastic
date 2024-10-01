import PropTypes from 'prop-types'
import ChoiceSelector from '../ChoiceSelector/ChoiceSelector'
import "./styles/TeamMemberInfo.css"
import { getContrastTextColor } from '../../utils/getContrastTextColor'

const TeamMemberInfo = ({member}) => {
    const textColor = getContrastTextColor(`${member.color}`)

    console.log(textColor)
    return (
        <div className="team-member-info">
            <h4>{member.name}</h4>
            <p>{member.role}</p>
            <span style={{ backgroundColor: `#${member.color}`, padding: '2px 10px', color: `${textColor}` }}>#{member.color}</span>
            <div className="team-member-info-selector-container">
                {member.pending ? <ChoiceSelector order={true} id={member.id} initialChecked={true} disabled={true} className="team-member-info">Pending</ChoiceSelector> : null}
                <ChoiceSelector order={true} id={member.id} initialChecked={member.admin} className="team-member-info">Admin?</ChoiceSelector>
            </div>
            <button>Delete Team Member</button>
        </div>
    )
}

TeamMemberInfo.propTypes = {
    member: PropTypes.object.isRequired
}

export default TeamMemberInfo
