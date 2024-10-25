import { useState, useEffect } from 'react';
import useTaskService from "../services/taskService"

const useKanbanStats = (project) => {
    console.log(project)
    const [columnStats, setColumnStats] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const taskService = useTaskService()

    const calculateColumnStats = async () => {
        if (!project || !project?._id || !project.kanbanColumns) {
            setLoading(false)
            return
        }

        try {
            const projectTasks = await taskService.fetchProjectTasks(project._id)

            const today = new Date()
            const threeDaysFromNow = new Date(today)
            threeDaysFromNow.setDate(today.getDate() + 3)

            const sevenDaysAgo = new Date(today)
            sevenDaysAgo.setDate(today.getDate() - 7)

            const chartData = project.kanbanColumns.map(column => ({
                name: column.name,
                "Tasks Due Next 3 Days": 0,
                "Tasks Completed Last 7 Days": 0,
                "Overdue Tasks": 0
            }))
            projectTasks.forEach(task => {
                const dueDate = new Date(task.dueDate)
                const completedDate = task.completedAt ? new Date(task.completedAt) : null

                // Find the corresponding column in our chart data
                const columnIndex = chartData.findIndex(col => col.name === task.status)
                if (columnIndex === -1) return

                // Tasks due in next 3 days
                if (dueDate <= threeDaysFromNow && dueDate >= today) {
                    chartData[columnIndex]["Tasks Due Next 3 Days"]++
                }

                // Tasks completed in last 7 days
                if (completedDate && completedDate >= sevenDaysAgo) {
                    chartData[columnIndex]["Tasks Completed Last 7 Days"]++
                }

                // Overdue tasks
                if (dueDate < today && !completedDate) {
                    chartData[columnIndex]["Overdue Tasks"]++
                }
            })

            setColumnStats(chartData)
        } catch (err) {
            setError(err.message)
            console.error('Error calculating kanban stats:', err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        calculateColumnStats()
    }, [project?._id])

    return {
        columnStats,
        loading,
        error,
        refreshStats: calculateColumnStats
    }
}

export default useKanbanStats
