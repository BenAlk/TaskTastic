import { useState } from 'react'
import PropTypes from 'prop-types'
import Modal from '../../../../components/Modal/Modal'
import { createMemberTemplate, isValidMember } from '../../utils/memberTemplateUtils'
import { activeTeamMember } from '../NewProjectDetails/testData/testData'
import { getContrastTextColor } from '../../utils/getContrastTextColor'
import "./styles/AddTeamMemberModal.css"

const AddTeamMemberModal = ({ isOpen, onClose, onAddMember, existingTeam }) => {
    const [modalMode, setModalMode] = useState('choose')
    const [newMemberData, setNewMemberData] = useState(createMemberTemplate())
    const [selectedExistingMembers, setSelectedExistingMembers] = useState([])

    const handleExistingMemberToggle = (memberId) => {
        setSelectedExistingMembers(prev =>
            prev.includes(memberId)
                ? prev.filter(id => id !== memberId)
                : [...prev, memberId]
        )
    }

    const handleNewMemberInputChange = (e) => {
        const { name, value } = e.target
        setNewMemberData(prev => ({ ...prev, [name]: value }))
    }

    const handleModalSubmit = () => {
        if (modalMode === 'existing') {
            const newMembers = activeTeamMember.activeTeam.filter(member =>
                selectedExistingMembers.includes(member.id)
            )
            newMembers.forEach(onAddMember)
        } else if (modalMode === 'new' && isValidMember(newMemberData)) {
            const avatarUrl = `https://ui-avatars.com/api/?background=${newMemberData.color}&color=${getContrastTextColor(newMemberData.color)}&name=${encodeURIComponent(newMemberData.name)}`
            const newMember = {
                ... newMemberData,
                avatar: avatarUrl,
                pending: true,
                admin: false
            }
            onAddMember(newMember)
        }
        handleModalClose()
    }

    const handleModalClose = () => {
        onClose()
        setModalMode('choose')
        setNewMemberData(createMemberTemplate())
        setSelectedExistingMembers([])
    }

    const isTeamMemberChosen = (memberId) => {
        return existingTeam.some(member => member.id === memberId)
    }

    return (
        <Modal isOpen={isOpen} onClose={handleModalClose} className="new-team-member-modal">
            {modalMode === 'choose' && (
                <div className="add-team-member-modal-container">
                    <div className="add-team-member-modal-title-container">
                        <h2>Add Team Members</h2>
                    </div>
                    <div className="add-team-member-modal-buttons-container">
                        <button onClick={() => setModalMode('existing')}>Add Existing Member</button>
                        <button onClick={() => setModalMode('new')}>Create New Member</button>
                    </div>
                </div>
            )}
            {modalMode === 'existing' && (
                <div className="existing-team-members-modal-container">
                    <div className="existing-team-members-modal-title">
                        <h2>Select Existing Team Members</h2>
                    </div>
                    <div className="existing-team-members-modal-list-container">
                    {activeTeamMember.activeTeam.map(member => (
                        <div key={member.id} className="member">
                            <input
                                type="checkbox"
                                id={`member-${member.id}`}
                                checked={selectedExistingMembers.includes(member.id)}
                                onChange={() => handleExistingMemberToggle(member.id)}
                                disabled={isTeamMemberChosen(member.id)}
                            />
                            <div className="member-name">
                            <label htmlFor={`member-${member.id}`}>{member.name}</label>
                                </div>
                            <div className="member-role">
                                <label htmlFor={`member-${member.id}`}>{member.role}</label>
                            </div>
                        </div>
                    ))}
                    </div>
                    <div className="existing-team-member-modal-buttons-container">
                        <button onClick={handleModalSubmit}>Add Selected Members</button>
                    </div>
                </div>
            )}
            {modalMode === 'new' && (
                <div className="new-team-member-modal-container">
                    <div className="new-team-member-modal-title">
                        <h2>Create New Team Member</h2>
                    </div>
                    <div className="new-team-member-modal-input-container">
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={newMemberData.name}
                            onChange={handleNewMemberInputChange}
                        />
                        <input
                            type="text"
                            name="role"
                            placeholder="Role"
                            value={newMemberData.role}
                            onChange={handleNewMemberInputChange}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={newMemberData.email}
                            onChange={handleNewMemberInputChange}
                        />
                        <input
                            type="text"
                            name="color"
                            placeholder="Hex Color - No #"
                            value={newMemberData.color}
                            onChange={handleNewMemberInputChange}
                        />
                    </div>
                    <div className="new-team-member-modal-buttons-container">
                        <button onClick={handleModalSubmit}>Add New Member</button>
                    </div>
                </div>
            )}
        </Modal>
    )
}

AddTeamMemberModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onAddMember: PropTypes.func.isRequired,
    existingTeam: PropTypes.array.isRequired,
}

export default AddTeamMemberModal
