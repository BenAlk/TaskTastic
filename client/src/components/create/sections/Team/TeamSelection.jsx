import { useState } from 'react'
import { PropTypes } from 'prop-types'
import { AnimatePresence } from 'framer-motion'
import TeamMember from './TeamMember'
import styles from './TeamSelection.module.css'
import useUserService from '../../../../services/usersService'

const TeamSelection = ({ formData, setFormData, errors }) => {
    const [searchEmail, setSearchEmail] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isSearching, setIsSearching ] = useState(false)

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    }

    const handleSearch = async(email) => {
        if(!validateEmail(email)) return

        setIsSearching(true)
        try {
            const results = await useUserService.searchUsers(email)
            const filteredResults = results.filter(user =>
                !formData.team.some(member => member.user === user._id)
            )
            setSearchResults(filteredResults)
        } catch (error) {
            console.error('Error searching users:', error)
        } finally {
            setIsSearching(false)
        }
    }

    const handleSearchInputChange = (e) => {
        const value = e.target.value
        setSearchEmail(value)

        if(value.length >= 3) {
            handleSearch(value)
        } else {
            setSearchResults([])
        }
    }

    const handleAddTeamMember = (user) => {
        const newTeamMember = {
            user: user._id,
            email: user.email,
            role: 'member'
        }

        setFormData(prev => ({
            ...prev,
            team: [...prev.team, newTeamMember]
        }))
        setSearchEmail('')
        setSearchResults([])
    }

    const handleRemoveTeamMember = (userId) => {
        setFormData(prev => ({
            ...prev,
            team: prev.team.filter(member => member.user !== userId)
        }))
    }

    const handleToggleAdmin = (userId) => {
        setFormData(prev => ({
            ...prev,
            team: prev.team.map(member =>
                member.user === userId
                    ? { ...member, role: member.role === 'admin' ? 'member' : 'admin' }
                    : member
            )
        }))
    }

    return(
        <div className={styles['team-selection-container']}>
            <div className={styles['team-selection-header-container']}>
                <div className={styles['team-selection-add-icon']}>+</div>
                <h2 className={styles['team-selection-title']}>Team Selection</h2>
            </div>

            <div className={styles['search-container']}>
                <div className={styles['search-input-wrapper']}>
                    <h2>search</h2>
                    <input
                        type="email"
                        value={searchEmail}
                        onChange={handleSearchInputChange}
                        placeholder="Search by email"
                        className={styles['search-input']}
                    />
                </div>
                {errors?.search && (
                    <span className={styles['error-text']}>{errors.search}</span>
                )}
            </div>

            {isSearching && (
                <div className={styles['search-indicator']}>
                    Searching...
                </div>
            )}

            {searchResults.length > 0 && (
                <div className={styles['search-results']}>
                    {searchResults.map(user=> (
                        <div key={user._id} className={styles['search-result-item']}>
                            <span>{user.email}</span>
                            <button
                                onClick={() => handleAddTeamMember(user)}
                                className={styles['add-button']}
                            >
                                Add to team
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className={styles['team-list']}>
                <h3 className={styles['sub-title']}>Team Members</h3>
                <AnimatePresence>
                    {formData.team.map(member => (
                        <TeamMember
                            key={member.user}
                            member={member}
                            onRemove={handleRemoveTeamMember}
                            onToggleAdmin={handleToggleAdmin}
                            canBeAdmin={formData.secondaryAdminsAllowed}
                            isOwner={member.user === formData.projectOwner}
                        />
                    ))}
                </AnimatePresence>
                {formData.team.length === 0 && (
                    <div className={styles['empty-state']}>
                        No team members added yet.
                    </div>
                )}
            </div>
        </div>
    )
}

TeamSelection.propTypes = {
    formData: PropTypes.shape({
        team: PropTypes.arrayOf(PropTypes.shape({
            user: PropTypes.string,
            email: PropTypes.string,
            role: PropTypes.oneOf(['admin', 'member'])
        })),
        projectOwner: PropTypes.string,
        secondaryAdminsAllowed: PropTypes.bool
    }),
    setFormData: PropTypes.func,
    errors: PropTypes.shape({
        search: PropTypes.string,
        team: PropTypes.string
    })
}

export default TeamSelection
