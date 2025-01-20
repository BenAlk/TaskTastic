import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from "prop-types"
import {
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts'
import { useProjectContext } from "../../../context/ProjectContext"
import { useTaskContext } from "../../../context/TaskContext"
import { addDays, subDays, isAfter, isBefore, isToday } from 'date-fns'
import styles from './TaskSection.module.css'

const TaskSection = ({ height, width }) => {
    const [chartData, setChartData] = useState([])
    const { currentProject } = useProjectContext()
    const { tasks, fetchTasks } = useTaskContext()
    const navigate = useNavigate()

    useEffect(() => {
        if (currentProject?._id) {
            fetchTasks(currentProject._id)
        }
    }, [currentProject])

    const handleClick = () => {
        navigate('/kanban')
    }

    const processColor = (color) => {
        if (!color) return '#8884d8'

        if (color.startsWith('#')) return color

        try {
            const tempElement = document.createElement('div')
            tempElement.style.color = color
            document.body.appendChild(tempElement)
            const computedColor = getComputedStyle(tempElement).color
            document.body.removeChild(tempElement)

            if (computedColor.startsWith('rgb')) {
                const [r, g, b] = computedColor.match(/\d+/g)
                return `#${Number(r).toString(16).padStart(2, '0')}${Number(g).toString(16).padStart(2, '0')}${Number(b).toString(16).padStart(2, '0')}`
            }
            return color
        } catch (e) {
            return '#8884d8'
        }
    };

    useEffect(() => {
        if (!tasks || !currentProject?.kanbanColumns) return

        const today = new Date()
        const threeDaysFromNow = addDays(today, 3)
        const sevenDaysAgo = subDays(today, 7)

        const columnData = currentProject.kanbanColumns.reduce((acc, column) => {
            acc[column._id] = {
                name: column.name,
                color: processColor(column.color),
                "Total Tasks": 0,
                "Tasks Due Next 3 Days": 0,
                "Overdue Tasks": 0,
                "Tasks Completed Last 7 Days": 0,
                "At Risk Tasks": 0,
                order: column.order || 0
            }
            return acc
        }, {})

        tasks.forEach(task => {
            const column = columnData[task.kanbanColumnId]
            if (!column) return

            column["Total Tasks"]++

            if (task.completedDate) {
                const completedDate = new Date(task.completedDate)
                if (isAfter(completedDate, sevenDaysAgo)) {
                    column["Tasks Completed Last 7 Days"]++
                }
            }

            if (task.dueDate && !task.completedDate) {
                const dueDate = new Date(task.dueDate)
                if (isBefore(dueDate, today)) {
                    column["Overdue Tasks"]++
                } else if (
                    (isAfter(dueDate, today) || isToday(dueDate)) &&
                    (isBefore(dueDate, threeDaysFromNow) || isToday(dueDate))
                ) {
                    column["Tasks Due Next 3 Days"]++
                }
            }

            if (task.risk?.isAtRisk) {
                column["At Risk Tasks"]++
            }
        });

        const newChartData = Object.values(columnData)
            .sort((a, b) => a.order - b.order)

        setChartData(newChartData)
    }, [tasks, currentProject])

/* eslint react/prop-types: 0 */
    const CustomTooltip = ({ active, payload }) => {
        if (!active || !payload?.length) return null
        const data = payload[0].payload

        return (
            <div className={styles.tooltipContainer}>
                <div
                    className={styles.tooltipHeader}
                    style={{
                        borderLeft: `4px solid ${data.color}`,
                        backgroundColor: `${data.color}15`
                    }}
                >
                    <p className={styles.tooltipTitle}>{data.name}</p>
                </div>
                <p className={styles.tooltipRow}>Total Tasks: {data["Total Tasks"]}</p>
                <p className={styles.tooltipRow}>Due Soon: {data["Tasks Due Next 3 Days"]}</p>
                <p className={styles.tooltipRow}>Overdue: {data["Overdue Tasks"]}</p>
                <p className={styles.tooltipRow}>Recently Completed: {data["Tasks Completed Last 7 Days"]}</p>
                <p className={styles.tooltipRow}>At Risk: {data["At Risk Tasks"]}</p>
            </div>
        )
    }

    return (
        <div className={styles.container} >
            {chartData.length > 0 ? (
                <ResponsiveContainer width={width} height={height}>
                    <ComposedChart data={chartData} onClick={handleClick} cursor="pointer">
                        <XAxis
                            dataKey="name"
                            tick={{ fill: '#666', fontSize: 16, fontWeight: 700, dy: 10 }}
                            tickLine={false}
                            axisLine={{ stroke: '#666' }}
                        />
                        <YAxis
                            tickCount={5}
                            allowDecimals={false}
                            tick={{ fill: '#666', fontSize: 14 }}
                            tickLine={false}
                            axisLine={{ stroke: '#666' }}
                        />
                        <Bar dataKey="Total Tasks" barSize={60}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                        <Tooltip content={CustomTooltip} />
                    </ComposedChart>
                </ResponsiveContainer>
            ) : (
                <div className={styles.noData}>No tasks available</div>
            )}
        </div>
    )
}

TaskSection.propTypes = {
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
}

export default TaskSection
