export const projects = {
    projectList: [
        {
            "projectId": 1,
            "projectName": "Website Redesign",
            "projectOwner": "Alice Johnson",
            "projectStartDate": "2024-09-01",
            "projectTargetDate": "2024-12-31",
            "tasks": [
                {
                    id: 1,
                    name: "Design homepage mockup",
                    kanbanColumn: "In Progress",
                    urgent: true,
                    targetDate: "2024-09-21",
                    assignedTo: "Bob Smith",
                    completedDate: "",
                },
                {
                    id: 2,
                    name: "Implement responsive layout",
                    kanbanColumn: "In Progress",
                    urgent: false,
                    targetDate: "2024-09-17",
                    assignedTo: "Charlie Brown",
                    completedDate: "",
                },
                {
                    id: 3,
                    name: "Optimize database queries",
                    kanbanColumn: "Done",
                    urgent: true,
                    targetDate: "2024-09-19",
                    assignedTo: "Bob Smith",
                    completedDate: "2024-09-18",
                },
                {
                    id: 4,
                    name: "Create user authentication system",
                    kanbanColumn: "To Do",
                    urgent: false,
                    targetDate: "2024-09-25",
                    assignedTo: "Diana Prince",
                    completedDate: "",
                },
                {
                    id: 5,
                    name: "Write content for About page",
                    kanbanColumn: "Done",
                    urgent: false,
                    targetDate: "2024-09-15",
                    assignedTo: "Eve Taylor",
                    completedDate: "2024-09-14",
                },
                {
                    id: 6,
                    name: "Implement search functionality",
                    kanbanColumn: "In Progress",
                    urgent: true,
                    targetDate: "2024-09-22",
                    assignedTo: "Charlie Brown",
                    completedDate: "",
                },
                {
                    id: 7,
                    name: "Conduct user testing",
                    kanbanColumn: "To Do",
                    urgent: false,
                    targetDate: "2024-09-28",
                    assignedTo: "Eve Taylor",
                    completedDate: "",
                },
                {
                    id: 8,
                    name: "Optimize images for web",
                    kanbanColumn: "Done",
                    urgent: false,
                    targetDate: "2024-09-16",
                    assignedTo: "Diana Prince",
                    completedDate: "2024-09-15",
                },
                {
                    id: 9,
                    name: "Fix cross-browser compatibility issues",
                    kanbanColumn: "In Progress",
                    urgent: true,
                    targetDate: "2024-09-20",
                    assignedTo: "Bob Smith",
                    completedDate: "",
                },
                {
                    id: 10,
                    name: "Implement contact form",
                    kanbanColumn: "To Do",
                    urgent: false,
                    targetDate: "2024-09-23",
                    assignedTo: "Charlie Brown",
                    completedDate: "",
                },
            ],
            "kanban": {
                "columns": [
                    {
                        "name": "Backlog",
                        "color": "crimson"
                    },
                    {
                        "name": "To Do",
                        "color": "lightsalmon"
                    },
                    {
                        "name": "In Progress",
                        "color": "moccasin"
                    },
                    {
                        "name": "Review",
                        "color": "lightblue"
                    },
                    {
                        "name": "Done",
                        "color": "lightgreen"
                    },
                ]
            },
            "team": {
                "members": [
                    {
                        "id": 1,
                        "name": "Alice Johnson",
                        "role": "Project Manager",
                    },
                    {
                        "id": 2,
                        "name": "Bob Smith",
                        "role": "UI/UX Designer",
                        "activity": {
                            "completedTasks": 12,
                            "completeTasksInLast3Days": "1"
                        }
                    },
                    {
                        "id": 3,
                        "name": "Charlie Brown",
                        "role": "Frontend Developer",
                        "activity": {
                            "completedTasks": 8,
                            "completeTasksInLast3Days": "0"
                        }
                    },
                    {
                        "id": 4,
                        "name": "Diana Prince",
                        "role": "Backend Developer",
                        "activity": {
                            "completedTasks": 15,
                            "completeTasksInLast3Days": "5"
                        }
                    },
                    {
                        "id": 5,
                        "name": "Eve Taylor",
                        "role": "Project Manager",
                        "activity": {
                            "completedTasks": 5,
                            "completeTasksInLast3Days": "7"
                        }
                    }
                ]
            },
            "messages": {
                "directMessages": [
                    {
                        "from": 2,
                        "to": 3,
                        "content": "Hey, can you review the homepage design?",
                        "timestamp": "2024-09-15T14:30:00Z",
                        "markedRead": false
                    },
                    {
                        "from": 4,
                        "to": 5,
                        "content": "Database optimization is complete. Moving to the next task.",
                        "timestamp": "2024-09-20T11:15:00Z",
                        "markedRead": false
                    },
                    {
                        "from": 1,
                        "to": 5,
                        "content": "Database optimization is complete. Moving to the next task.",
                        "timestamp": "2024-09-20T11:15:00Z",
                        "markedRead": true
                    }
                ],
                "projectChatBoard": [
                    {
                        "author": 1,
                        "summary": "Team Meeting",
                        "content": "Team meeting scheduled for tomorrow at 10 AM.",
                        "timestamp": "2024-09-17T16:00:00Z"
                    },
                    {
                        "author": 5,
                        "summary": "Meeting Notes",
                        "content": "Great progress everyone! We're on track to meet our first milestone.Great progress everyone! We're on track to meet our first milestone.Great progress everyone! We're on track to meet our first milestone.",
                        "timestamp": "2024-09-21T09:45:00Z"
                    }
                ]
            },
            "risks": [
                {
                    "id": 1,
                    "userFlag": 3,
                    "riskLevel": "Critical",
                    "riskFactors": 
                        {
                        "timeline": 5,
                        "budget": 4,
                        "dependencies": 5,
                        "resources": 4,
                        "complexity": 5,
                        "total": 23
                        }
                },
                {
                    "id": 4,
                    "userFlag": 1,
                    "riskLevel": "High",
                    "riskFactors": 
                        {
                        "timeline": 5,
                        "budget": 3,
                        "dependencies": 5,
                        "resources": 3,
                        "complexity": 2,
                        "total": 18
                        }
                },
                {
                    "id": 8,
                    "userFlag": 1,
                    "riskLevel": "Medium",
                    "riskFactors": 
                        {
                        "timeline": 2,
                        "budget": 4,
                        "dependencies": 2,
                        "resources": 4,
                        "complexity": 0,
                        "total": 12
                        }
                },
                {
                    "id": 9,
                    "userFlag": 2,
                    "riskLevel": "Low",
                    "riskFactors": 
                        {
                        "timeline": 1,
                        "budget": 2,
                        "dependencies": 2,
                        "resources": 1,
                        "complexity": 1,
                        "total": 7
                        }
                },
            ]
        },
        {
            "projectId": 2,
            "projectName": "Mobile App Development",
            "projectOwner": "Frank Miller",
            "projectStartDate": "2024-08-01",
            "projectTargetDate": "2024-09-15",
            "tasks": [
                {
                    "id": 1,
                    "name": "Create app wireframes",
                    "kanbanColumn": "Done",
                    "urgent": true,
                    "targetDate": "2024-10-15",
                    "assignedTo": "Grace Lee",
                    "completedDate": "2024-10-14"
                },
                {
                    "id": 2,
                    "name": "Develop user authentication",
                    "kanbanColumn": "In Progress",
                    "urgent": true,
                    "targetDate": "2024-11-15",
                    "assignedTo": "Henry Ford",
                    "completedDate": ""
                },
                {
                    "id": 3,
                    "name": "Implement push notifications",
                    "kanbanColumn": "To Do",
                    "urgent": false,
                    "targetDate": "2024-12-01",
                    "assignedTo": "Ivy Chen",
                    "completedDate": ""
                }
            ],
            "kanban": {
                "columns": [
                    {
                        "name": "Backlog",
                        "color": "gray"
                    },
                    {
                        "name": "To Do",
                        "color": "lightyellow"
                    },
                    {
                        "name": "In Progress",
                        "color": "lightblue"
                    },
                    {
                        "name": "Testing",
                        "color": "lightorange"
                    },
                    {
                        "name": "Done",
                        "color": "lightgreen"
                    }
                ]
            },
            "team": {
                "members": [
                    {
                        "name": "Grace Lee",
                        "role": "UI/UX Designer",
                        "activity": {
                            "completedTasks": 7,
                            "completeTasksInLast3Days": "1"
                        }
                    },
                    {
                        "name": "Henry Ford",
                        "role": "iOS Developer",
                        "activity": {
                            "completedTasks": 5,
                            "completeTasksInLast3Days": "2"
                        }
                    },
                    {
                        "name": "Ivy Chen",
                        "role": "Android Developer",
                        "activity": {
                            "completedTasks": 6,
                            "completeTasksInLast3Days": "0"
                        }
                    },
                    {
                        "name": "Jack Wilson",
                        "role": "QA Tester",
                        "activity": {
                            "completedTasks": 4,
                            "completeTasksInLast3Days": "1"
                        }
                    }
                ]
            },
            "messages": {
                "directMessages": [
                    {
                        "from": "Grace Lee",
                        "to": "Henry Ford",
                        "content": "Wireframes are ready for the login screen.",
                        "timestamp": "2024-10-16T09:30:00Z"
                    },
                    {
                        "from": "Ivy Chen",
                        "to": "Jack Wilson",
                        "content": "Can you start testing the registration flow?",
                        "timestamp": "2024-11-02T14:45:00Z"
                    }
                ],
                "projectChatBoard": [
                    {
                        "author": "Frank Miller",
                        "content": "Remember to update your task status daily.",
                        "timestamp": "2024-10-05T11:00:00Z"
                    },
                    {
                        "author": "Jack Wilson",
                        "content": "Found a bug in the login process. Creating a ticket now.",
                        "timestamp": "2024-11-10T16:20:00Z"
                    }
                ]
            },
            "risks": []
        },
        {
            "projectId": 3,
            "projectName": "Data Analytics Platform",
            "projectOwner": "Karen Martinez",
            "projectStartDate": "2024-11-01",
            "projectTargetDate": "2025-05-31",
            "tasks": [
                {
                    "id": 1,
                    "name": "Design data schema",
                    "kanbanColumn": "Done",
                    "urgent": true,
                    "targetDate": "2024-11-30",
                    "assignedTo": "Liam Johnson",
                    "completedDate": "2024-11-28"
                },
                {
                    "id": 2,
                    "name": "Implement data ingestion pipeline",
                    "kanbanColumn": "In Progress",
                    "urgent": true,
                    "targetDate": "2024-12-31",
                    "assignedTo": "Mia Thompson",
                    "completedDate": ""
                },
                {
                    "id": 3,
                    "name": "Create visualization dashboard",
                    "kanbanColumn": "To Do",
                    "urgent": false,
                    "targetDate": "2025-01-31",
                    "assignedTo": "Noah Davis",
                    "completedDate": ""
                }
            ],
            "kanban": {
                "columns": [
                    {
                        "name": "Backlog",
                        "color": "lightgray"
                    },
                    {
                        "name": "Planning",
                        "color": "lightyellow"
                    },
                    {
                        "name": "In Progress",
                        "color": "lightblue"
                    },
                    {
                        "name": "QA",
                        "color": "lightorange"
                    },
                    {
                        "name": "Done",
                        "color": "lightgreen"
                    }
                ]
            },
            "team": {
                "members": [
                    {
                        "name": "Liam Johnson",
                        "role": "Data Architect",
                        "activity": {
                            "completedTasks": 9,
                            "completeTasksInLast3Days": "1"
                        }
                    },
                    {
                        "name": "Mia Thompson",
                        "role": "Data Engineer",
                        "activity": {
                            "completedTasks": 7,
                            "completeTasksInLast3Days": "2"
                        }
                    },
                    {
                        "name": "Noah Davis",
                        "role": "Data Visualization Specialist",
                        "activity": {
                            "completedTasks": 5,
                            "completeTasksInLast3Days": "0"
                        }
                    },
                    {
                        "name": "Olivia Wilson",
                        "role": "Machine Learning Engineer",
                        "activity": {
                            "completedTasks": 6,
                            "completeTasksInLast3Days": "1"
                        }
                    }
                ]
            },
            "messages": {
                "directMessages": [
                    {
                        "from": "Liam Johnson",
                        "to": "Mia Thompson",
                        "content": "The data schema is ready for your review.",
                        "timestamp": "2024-11-25T10:15:00Z"
                    },
                    {
                        "from": "Noah Davis",
                        "to": "Olivia Wilson",
                        "content": "Do you have any preferences for the ML model visualization?",
                        "timestamp": "2024-12-10T13:30:00Z"
                    }
                ],
                "projectChatBoard": [
                    {
                        "author": "Karen Martinez",
                        "content": "Great job on completing the data schema ahead of schedule!",
                        "timestamp": "2024-12-01T09:00:00Z"
                    },
                    {
                        "author": "Mia Thompson",
                        "content": "Heads up: we might need to upgrade our data processing infrastructure soon.",
                        "timestamp": "2024-12-15T11:45:00Z"
                    }
                ]
            },
            "risks": []
        }
    ]
}