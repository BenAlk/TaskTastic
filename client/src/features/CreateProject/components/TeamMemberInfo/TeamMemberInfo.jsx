import React, { useContext, useCallback, useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import ChoiceSelector from '../ChoiceSelector/ChoiceSelector'
import "./styles/TeamMemberInfo.css"
import { getContrastTextColor } from '../../utils/getContrastTextColor'
import { ProjectContext } from '../../ProjectContext'
import { TrashIcon } from '../../../../assets/icons'
const TeamMemberInfo = React.memo(({ member }) => {
    const { handleToggleAdmin, handleDeleteMember, projectData } = useContext(ProjectContext)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const deleteButtonRef = useRef(null)

    const textColor = getContrastTextColor(`${member.color}`)

    const confirmDeletion = () => {
        !confirmDelete ? setConfirmDelete(true) : null
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (deleteButtonRef.current && !deleteButtonRef.current.contains(event.target)) {
                setConfirmDelete(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    })

    const onDeleteMember = () => {
        handleDeleteMember(member.id)
        setConfirmDelete(false)  // Reset the confirmation state after deletion
    }

    const onAdminToggle = useCallback(() => {
        handleToggleAdmin(member.id);
    }, [handleToggleAdmin, member.id]);

    return (
        <div className="team-member-info">
            <h4>{member.name}</h4>
            <p>{member.role}</p>
            <span style={{ backgroundColor: `#${member.color}`, padding: '2px 10px', color: `${textColor}` }}>#{member.color}</span>
            <div className="team-member-info-selector-container">
                {member.pending && (
                    <ChoiceSelector
                        order={true}
                        id={`pending-${member.id}`}
                        checked={true}
                        onChange={() => {}}
                        disabled={true}
                        className="team-member-info"
                    >
                        Pending
                    </ChoiceSelector>
                )}
                <ChoiceSelector
                    order={true}
                    id={`admin-${member.id}`}
                    checked={member.admin}
                    onChange={onAdminToggle}
                    className="team-member-info"
                    disabled={member.name === projectData.owner}
                >
                    Admin
                </ChoiceSelector>
            </div>
            <div className="delete-team-member-stage-one">
                {member.name === projectData.owner ? null : <button onClick={() => confirmDeletion(member.id)}>Delete Team Member</button> }
                {confirmDelete && <div className="delete-team-member-stage-two" onClick={() => onDeleteMember(member.id)}>
                    <TrashIcon />
                </div>}
            </div>
        </div>
    )
})

TeamMemberInfo.propTypes = {
    member: PropTypes.object.isRequired
}

TeamMemberInfo.displayName = 'TeamMemberInfo';

export default TeamMemberInfo
