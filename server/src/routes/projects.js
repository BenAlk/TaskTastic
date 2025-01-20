import express from 'express'
import { ProjectModel } from "../models/Projects.js"
import { verifyToken, preventDemoModification } from "../middleware/auth.js"

const router = express.Router()

router.post("/newProject", verifyToken, preventDemoModification, async (req, res) => {
    try {
        const {
            projectName,
            startDate,
            targetDate,
            secondaryAdminsAllowed,
            eisenhowerEnabled,
            kanbanColumns
        } = req.body

        if (kanbanColumns && (!Array.isArray(kanbanColumns) || kanbanColumns.some(col => !col.name || typeof col.order !== 'number'))){
            return res.status(400).json({message: "Invalid kanban column format"})
        }

        const newProject = new ProjectModel({
            projectName,
            projectOwner: req.userId,
            setupDate: new Date(),
            startDate,
            targetDate,
            secondaryAdminsAllowed,
            eisenhowerEnabled,
            team: [{user: req.userId, role: 'admin'}],
            kanbanColumns: kanbanColumns || [
                { name: 'To Do', color: '#E2E8F0', maxDays: 0, maxTasks: 0, order: 0 },
                { name: 'In Progress', color: '#93C5FD', maxDays: 5, maxTasks: 5, order: 1 },
                { name: 'Done', color: '#86EFAC', maxDays: 0, maxTasks: 0, order: 2 }
            ]
        })

        const savedProject = await newProject.save()
        return res.status(201).json(newProject)
    } catch (error) {
        console.error("Project creation error:", error)
        return res.status(500).json({ message: "Error creating project", error: error.message })
    }
})

router.get("/", verifyToken, async (req, res) => {
    try {
        const userId = req.userId
        const projects = await ProjectModel.find({'team.user': userId})
        return res.json(projects)

    } catch(error) {
        return res.status(500).json({message: "Error fetching projects", error: error.message})
    }
})

router.get("/:projectId", verifyToken, async (req, res) => {
    try {
        const project = await ProjectModel.findOne({
            _id: req.params.projectId,
            'team.user': req.userId
        })
        if (!project) {
            return res.status(404).json({ message: "Project not found" })
        }
        return res.json(project)
    } catch (error) {
        console.error("Error fetching project:", error)
        return res.status(500).json({ message: "Error fetching project", error: error.message })
    }
})

router.put("/:projectId", verifyToken, preventDemoModification, async (req, res) => {
    try {
        const project = await ProjectModel.findOneAndUpdate(
            {_id: req.params.projectId, projectOwner: req.userId},
            req.body,
            {new: true}
        )
        if (!project){
            return res.status(404).json({ message: "Project not found or access denied"})
        }
        return res.json(project)
    } catch(error) {
        return res.status(500).json({ message: "Error updating project", error: error.message})
    }
})

router.delete("/:projectId", verifyToken, preventDemoModification, async (req, res) => {
    try{
        const project = await ProjectModel.findOneAndDelete({ _id: req.params.projectId, projectOwner: req.userId})
        if(!project){
            return res.status(404).json({ message: "Project not found or access denied" })
        }
        return res.json({ message: "Project deleted successfully"})
    } catch (error){
        return res.status(500).json({ message: "Error deleting project", error: error.message})
    }
})

router.post("/:projectId/team", verifyToken, preventDemoModification, async (req, res) => {
    try {
        const { userId, role } = req.body
        const project = await ProjectModel.findOneAndUpdate(
            { _id: req.params.projectId, projectOwner: req.userId},
            { $addToSet: { team: { user: userId, role } } },
            { new: true }
        )
        if(!project) {
            return res.status(404).json({ message: "Project not found or access denied" })
        }
        return res.json(project)
    } catch(error) {
        return res.status(500).json({ message: "Error adding team member", error: error.message })
    }
})

router.delete("/:projectId/team/:userId", verifyToken, preventDemoModification, async (req, res) => {
    try {
        const project = await ProjectModel.findOneAndUpdate(
            { _id: req.params.projectId, projectOwner: req.userId },
            { $pull: { team: { user: req.params.userId } } },
            { new : true }
        )
        if(!project) {
            return res.status(404).json({ message: "Project not found or access denied" })
        }
        return res.json(project)
    } catch (error){
        return res.status(500).json({ message: "Error removing team member", error: error.message })
    }
})

router.put("/:projectId/kanban", verifyToken, preventDemoModification, async (req, res) => {
    try {
        const { columns } = req.body
        const project = await ProjectModel.findOneAndUpdate(
            {_id: req.params.projectId, 'team.user': req.userId },
            { $set: { kanbanColumns: columns } },
            { new: true }
        )
        if(!project) {
            return res.status(404).json({ message: "Project not found or access denied" })
        }
        return res.json(project)
    } catch (error){
        return res.status(500).json({ message: "Error updating kanban columns", error: error.message })
    }
})

router.put("/:projectId/transfer", verifyToken, preventDemoModification, async (req, res) => {
    try {
        const { newOwnerId } = req.body
        const project = await ProjectModel.findOne({
            _id: req.params.projectId,
            projectOwner: req.userId
        })

        if (!project) {
            return res.status(404).json({ message: "Project not found or access denied" })
        }

        const isAdmin = project.team.some(member =>
            member.user.toString() === newOwnerId &&
            member.role === 'admin'
        )

        if (!isAdmin) {
            return res.status(400).json({
                message: "New owner must be an existing admin in the project"
            })
        }

        project.projectOwner = newOwnerId
        await project.save()

        return res.json(project)
    } catch (error) {
        return res.status(500).json({
            message: "Error transferring ownership",
            error: error.message
        })
    }
})

export { router as projectRouter }
