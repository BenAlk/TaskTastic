import express from 'express'
import { ProjectModel } from "../models/Projects.js"
import { verifyToken } from "../middleware/auth.js"

const router = express.Router()

//Create New Project
router.post("/newProject", verifyToken, async (req, res) => {
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
                {name: 'To Do', order: 0},
                {name: 'In Progress', order: 1},
                {name: 'Done', order: 2}
            ]
        })

        const savedProject = await newProject.save()
        return res.status(201).json(newProject)
    } catch (error) {
        console.error("Project creation error:", error)
        return res.status(500).json({ message: "Error creating project", error: error.message })
    }
})

    // Retrieve all projects for a user
    router.get("/", verifyToken, async (req, res) => {
        try {
            const userId = req.userId
            const projects = await ProjectModel.find({'team.user': userId})
            console.log(projects)
            return res.json(projects)

        } catch(error) {
            return res.status(500).json({message: "Error fetching projects", error: error.message})
        }
    })

    // Retrieve a specific project by ID
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


    //Update a project
    router.put("/:projectId", verifyToken, async (req, res) => {
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

    //Delete a project
    router.delete("/:projectId", verifyToken, async (req, res) => {
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

    //Add a new team member to a project
    router.post("/:projectId/team", verifyToken, async (req, res) => {
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

    //Remove a team member from a project
    router.delete("/:projectId/team/:userId", verifyToken, async (req, res) => {
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

    //Update Kanban Columns
    router.put("/:projectId/kanban", verifyToken, async (req, res) => {
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

    export { router as projectRouter }
