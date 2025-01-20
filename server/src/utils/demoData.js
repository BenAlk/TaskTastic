import { UserModel } from '../models/Users.js'
import { ProjectModel } from '../models/Projects.js'
import { TaskModel } from '../models/Tasks.js'
import { MessageModel } from '../models/Messages.js'
import bcrypt from 'bcrypt'

export const createDemoData = async (demoUserId) => {
    try {
        const teamMembers = await UserModel.insertMany([
            {
                email: "sarah.team@demo.com",
                firstName: "Sarah",
                lastName: "Chen",
                password: await bcrypt.hash("demo-password", 10)
            },
            {
                email: "mike.team@demo.com",
                firstName: "Mike",
                lastName: "Rodriguez",
                password: await bcrypt.hash("demo-password", 10)
            }
        ])

        const marketingProject = new ProjectModel({
            projectName: "Q1 Marketing Campaign",
            projectOwner: demoUserId,
            setupDate: new Date(),
            startDate: new Date(),
            targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
            secondaryAdminsAllowed: true,
            eisenhowerEnabled: true,
            team: [
                { user: demoUserId, role: 'admin' },
                { user: teamMembers[0]._id, role: 'member' },
                { user: teamMembers[1]._id, role: 'member' }
            ],
            kanbanColumns: [
                { name: 'To Do', color: '#E2E8F0', maxDays: 0, maxTasks: 0, order: 0 },
                { name: 'In Progress', color: '#93C5FD', maxDays: 5, maxTasks: 5, order: 1 },
                { name: 'Review', color: '#FCD34D', maxDays: 2, maxTasks: 3, order: 2 },
                { name: 'Done', color: '#86EFAC', maxDays: 0, maxTasks: 0, order: 3 }
            ]
        })
        await marketingProject.save()

        const websiteProject = new ProjectModel({
            projectName: "Website Redesign",
            projectOwner: demoUserId,
            setupDate: new Date(),
            startDate: new Date(),
            targetDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            secondaryAdminsAllowed: true,
            eisenhowerEnabled: true,
            team: [
                { user: demoUserId, role: 'admin' },
                { user: teamMembers[0]._id, role: 'admin' },
                { user: teamMembers[1]._id, role: 'member' }
            ],
            kanbanColumns: [
                { name: 'Backlog', color: '#E2E8F0', maxDays: 0, maxTasks: 0, order: 0 },
                { name: 'In Progress', color: '#93C5FD', maxDays: 5, maxTasks: 5, order: 1 },
                { name: 'Testing', color: '#FCD34D', maxDays: 2, maxTasks: 3, order: 2 },
                { name: 'Done', color: '#86EFAC', maxDays: 0, maxTasks: 0, order: 3 }
            ]
        })
        await websiteProject.save()

        const appProject = new ProjectModel({
            projectName: "Mobile App Launch",
            projectOwner: teamMembers[0]._id,
            setupDate: new Date(),
            startDate: new Date(),
            targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            secondaryAdminsAllowed: true,
            eisenhowerEnabled: true,
            team: [
                { user: teamMembers[0]._id, role: 'admin' },
                { user: demoUserId, role: 'member' },
                { user: teamMembers[1]._id, role: 'member' }
            ],
            kanbanColumns: [
                { name: 'Planning', color: '#E2E8F0', maxDays: 0, maxTasks: 0, order: 0 },
                { name: 'Development', color: '#93C5FD', maxDays: 5, maxTasks: 5, order: 1 },
                { name: 'QA', color: '#FCD34D', maxDays: 2, maxTasks: 3, order: 2 },
                { name: 'Released', color: '#86EFAC', maxDays: 0, maxTasks: 0, order: 3 }
            ]
        })
        await appProject.save()

        const allTasks = [
            {
                projectId: marketingProject._id,
                title: "Social Media Content Calendar",
                description: "Create content calendar for Q1 social media posts",
                assignedTo: teamMembers[0]._id,
                kanbanColumnId: marketingProject.kanbanColumns[1]._id,
                eisenhowerStatus: { important: true, urgent: true },
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                risk: { isAtRisk: false }
            },
            {
                projectId: marketingProject._id,
                title: "Email Campaign Design",
                description: "Design templates for monthly newsletter",
                assignedTo: teamMembers[1]._id,
                kanbanColumnId: marketingProject.kanbanColumns[0]._id,
                eisenhowerStatus: { important: true, urgent: false },
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                risk: { isAtRisk: false }
            },
            {
                projectId: marketingProject._id,
                title: "Campaign Analytics Setup",
                description: "Set up tracking for all campaign channels",
                assignedTo: demoUserId,
                kanbanColumnId: marketingProject.kanbanColumns[2]._id,
                eisenhowerStatus: { important: false, urgent: true },
                dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                risk: {
                    isAtRisk: true,
                    riskType: "deadline",
                    riskDescription: "Delayed due to tracking tool issues",
                    flaggedBy: "user",
                    flaggedByUserId: demoUserId,
                    flaggedAt: new Date()
                }
            },

            {
                projectId: websiteProject._id,
                title: "User Research",
                description: "Conduct user interviews and create personas",
                assignedTo: teamMembers[0]._id,
                kanbanColumnId: websiteProject.kanbanColumns[1]._id,
                eisenhowerStatus: { important: true, urgent: false },
                dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                risk: { isAtRisk: false }
            },
            {
                projectId: websiteProject._id,
                title: "Wireframe Design",
                description: "Create wireframes for key pages",
                assignedTo: demoUserId,
                kanbanColumnId: websiteProject.kanbanColumns[0]._id,
                eisenhowerStatus: { important: true, urgent: true },
                dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
                risk: { isAtRisk: false }
            },
            {
                projectId: websiteProject._id,
                title: "Content Migration",
                description: "Plan and execute content migration strategy",
                assignedTo: teamMembers[1]._id,
                kanbanColumnId: websiteProject.kanbanColumns[2]._id,
                eisenhowerStatus: { important: false, urgent: false },
                dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
                risk: {
                    isAtRisk: true,
                    riskType: "resource",
                    riskDescription: "Need additional content writers",
                    flaggedBy: "user",
                    flaggedByUserId: teamMembers[1]._id,
                    flaggedAt: new Date()
                }
            },

            {
                projectId: appProject._id,
                title: "Feature Specification",
                description: "Document core features and user stories",
                assignedTo: teamMembers[0]._id,
                kanbanColumnId: appProject.kanbanColumns[2]._id,
                eisenhowerStatus: { important: true, urgent: true },
                dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                risk: { isAtRisk: false }
            },
            {
                projectId: appProject._id,
                title: "UI Component Library",
                description: "Create reusable UI components",
                assignedTo: demoUserId,
                kanbanColumnId: appProject.kanbanColumns[1]._id,
                eisenhowerStatus: { important: false, urgent: true },
                dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
                risk: { isAtRisk: false }
            },
            {
                projectId: appProject._id,
                title: "App Store Submission",
                description: "Prepare and submit app for store review",
                assignedTo: teamMembers[1]._id,
                kanbanColumnId: appProject.kanbanColumns[0]._id,
                eisenhowerStatus: { important: true, urgent: false },
                dueDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
                risk: {
                    isAtRisk: true,
                    riskType: "technical",
                    riskDescription: "Pending security review completion",
                    flaggedBy: "system",
                    flaggedByUserId: null,
                    flaggedAt: new Date()
                }
            }
        ]

        await TaskModel.insertMany(allTasks)

        const allMessages = [
            {
                projectId: marketingProject._id,
                sender: demoUserId,
                type: 'board',
                content: {
                    text: "Welcome to the Q1 Marketing Campaign! Let's make this our best quarter yet.",
                    mentions: []
                },
                metadata: {
                    priority: 'normal',
                    tags: ['welcome', 'kickoff']
                },
                read: [demoUserId]
            },
            {
                projectId: marketingProject._id,
                sender: teamMembers[0]._id,
                type: 'board',
                content: {
                    text: "Content calendar draft is ready for review @Demo User",
                    mentions: [{ user: demoUserId, position: 35 }]
                },
                metadata: {
                    priority: 'high',
                    tags: ['review']
                },
                read: [teamMembers[0]._id]
            },

            {
                projectId: websiteProject._id,
                sender: demoUserId,
                type: 'board',
                content: {
                    text: "Updated wireframes are available in the shared drive for review.",
                    mentions: []
                },
                metadata: {
                    priority: 'normal',
                    tags: ['design', 'review']
                },
                read: [demoUserId]
            },
            {
                projectId: websiteProject._id,
                sender: teamMembers[1]._id,
                recipients: [demoUserId],
                type: 'direct',
                content: {
                    text: "Can we discuss the content migration timeline?",
                    mentions: []
                },
                metadata: {
                    priority: 'high',
                    tags: ['timeline']
                },
                read: [teamMembers[1]._id]
            },

            {
                projectId: appProject._id,
                sender: teamMembers[0]._id,
                type: 'board',
                content: {
                    text: "Security audit scheduled for next week. @Mike Rodriguez please prepare documentation.",
                    mentions: [{ user: teamMembers[1]._id, position: 45 }]
                },
                metadata: {
                    priority: 'urgent',
                    tags: ['security', 'audit']
                },
                read: [teamMembers[0]._id]
            },
            {
                projectId: appProject._id,
                sender: demoUserId,
                type: 'board',
                content: {
                    text: "UI Component library is now at 60% completion.",
                    mentions: []
                },
                metadata: {
                    priority: 'normal',
                    tags: ['progress', 'development']
                },
                read: [demoUserId, teamMembers[0]._id]
            }
        ]

        await MessageModel.insertMany(allMessages)

        return {
            demoUser: { _id: demoUserId },
            teamMembers,
            projects: {
                marketing: marketingProject,
                website: websiteProject,
                app: appProject
            }
        }

    } catch (error) {
        console.error("Error creating demo data:", error)
        throw error
    }
}
