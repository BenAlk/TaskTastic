import express from 'express'
import { TaskModel } from '../models/Tasks.js'
import { ProjectModel } from '../models/Projects.js'
import { verifyToken, preventDemoModification } from '../middleware/auth.js'

const router = express.Router()

    router.post("/", verifyToken, preventDemoModification, async (req, res) => {
        try {
            const { projectId, title, description, assignedTo, kanbanColumnId, eisenhowerStatus, dueDate } = req.body
            const project = await ProjectModel.findOne({ _id: projectId, 'team.user': req.userId })
            if (!project) {
                return res.status(404).json({ message: "Project not found or access denied" })
            }
            const newTask = new TaskModel({
                projectId,
                title,
                description,
                assignedTo,
                kanbanColumnId,
                eisenhowerStatus,
                dueDate,
                createdBy: req.userId
            })
            await newTask.save()
            res.status(201).json(newTask)
        } catch (error) {
            console.error("Task creation error:", error)
            res.status(500).json({ message: "Error creating task", error: error.message })
        }
    })

    router.get("/project/:projectId", verifyToken, async (req, res) => {
        try {
            const project = await ProjectModel.findOne({ _id: req.params.projectId, 'team.user': req.userId })
            if (!project) {
                return res.status(404).json({ message: "Project not found or access denied" })
            }
            const tasks = await TaskModel.find({ projectId: req.params.projectId })
            res.json(tasks)
        } catch (error) {
            res.status(500).json({ message: "Error fetching tasks", error: error.message })
        }
    })

    router.get("/:taskId", verifyToken, async (req, res) => {
        try {
            const task = await TaskModel.findById(req.params.taskId )
            if (!task) {
                return res.status(404).json({ message: "Task not found" })
            }
            const project = await ProjectModel.findOne({ _id: task.projectId, 'team.user': req.userId })
            if (!project) {
                return res.status(404).json({ message: "Access denied" })
            }
            res.json(task)
        } catch (error) {
            res.status(500).json({ message: "Error fetching task", error: error.message })
        }
    })

    router.put("/:taskId", verifyToken, preventDemoModification, async (req, res) => {
        try {
            const task = await TaskModel.findById(req.params.taskId)
            if (!task) {
                return res.status(404).json({ message: "Task not found" })
            }
            const project = await ProjectModel.findOne({ _id: task.projectId, 'team.user': req.userId })
            if (!project) {
                return res.status(404).json({ message: "Access denied" })
            }
            const updatedTask = await TaskModel.findByIdAndUpdate(req.params.taskId, req.body, { new: true })
            res.json(updatedTask)
        } catch (error) {
            res.status(500).json({ message: "Error updating task", error: error.message })
        }
    })

    router.delete("/:taskId", verifyToken, preventDemoModification, async (req, res) => {
        try {
            const task = await TaskModel.findById(req.params.taskId)
            if (!task) {
                return res.status(404).json({ message: "Task not found" })
            }
            const project = await ProjectModel.findOne({ _id: task.projectId, 'team.user': req.userId })
            if (!project) {
                return res.status(404).json({ message: "Access denied" })
            }
            await TaskModel.findByIdAndDelete(req.params.taskId)
            res.json({ message: "Task deleted successfully" })
        } catch (error) {
            res.status(500).json({ message: "Error deleting task", error: error.message })
        }
    })

    router.put("/:taskId/risk", verifyToken, preventDemoModification, async (req, res) => {
        try {
            const { isAtRisk, riskType, riskDescription } = req.body
            const task = await TaskModel.findById(req.params.taskId)
            if (!task) {
                return res.status(404).json({ message: "Task not found" })
            }
            const project = await ProjectModel.findOne({ _id: task.projectId, 'team.user': req.userId })
            if (!project) {
                return res.status(404).json({ message: "Access denied" })
            }
            task.risk = {
                isAtRisk,
                riskType,
                riskDescription,
                flaggedBy: 'user',
                flaggedByUserId: req.userId,
                flaggedAt: Date.now()
            }
            await task.save()
            res.json(task)
        } catch (error) {
            res.status(500).json({ message: "Error updating task risk", error: error.message })
        }
    })

    router.get("/project/:projectId/at-risk", verifyToken, async (req, res) => {
        try {
            const project = await ProjectModel.findOne({
                _id: req.params.projectId,
                'team.user': req.userId
            })

            if (!project) {
                return res.status(404).json({
                    message: "Project not found or access denied"
                })
            }

            const riskyTasks = await TaskModel.find({
                projectId: req.params.projectId,
                'risk.isAtRisk': true  
            })

            res.json(riskyTasks)
        } catch (error) {
            res.status(500).json({
                message: "Error fetching at-risk tasks",
                error: error.message
            })
        }
    })

export { router as taskRouter }
