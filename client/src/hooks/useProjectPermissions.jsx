import { useCallback } from 'react'
import { useAuth } from '../context/AuthContext'
import { useProjectContext } from '../context/ProjectContext'

export const useProjectPermissions = () => {
    const { currentUser } = useAuth()
    const { currentProject } = useProjectContext()

    const getUserProjectRole = useCallback(() => {
        if (!currentProject || !currentUser) return null

        if (currentUser._id === currentProject.projectOwner) {
            return 'owner'
        }

        const teamMember = currentProject.team.find(
            member => member.user.toString() === currentUser._id
        )

        return teamMember?.role || null
    }, [currentProject, currentUser])

    const canEditKanbanBoard = useCallback(() => {
        const role = getUserProjectRole()
        return role === 'owner' || role === 'admin'
    }, [getUserProjectRole])

    const canMoveTask = useCallback((taskAssignedUserId) => {
        const role = getUserProjectRole()

        if (role === 'owner' || role === 'admin') return true

        return currentUser?._id === taskAssignedUserId
    }, [getUserProjectRole, currentUser])

    return {
        canEditKanbanBoard,
        canMoveTask,
        getUserProjectRole
    }
}
