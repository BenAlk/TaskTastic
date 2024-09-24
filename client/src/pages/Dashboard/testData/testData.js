export const projects = {
        "projectList": [
        {
            "projectId": 1,
            "projectName": "Website Redesign",
            "projectOwner": "Alice Johnson",
            "projectStartDate": "2024-09-01",
            "projectTargetDate": "2024-12-31",
            "tasks": [
            {
                "id": 1,
                "name": "Design homepage mockup",
                "kanbanColumn": "In Progress",
                "urgent": true,
                "targetDate": "2024-09-21",
                "assignedTo": "Bob Smith",
                "completedDate": ""
            },
            {
                "id": 2,
                "name": "Implement responsive layout",
                "kanbanColumn": "In Progress",
                "urgent": false,
                "targetDate": "2024-09-17",
                "assignedTo": "Charlie Brown",
                "completedDate": ""
            },
            {
                "id": 3,
                "name": "Optimize database queries",
                "kanbanColumn": "Done",
                "urgent": true,
                "targetDate": "2024-09-19",
                "assignedTo": "Bob Smith",
                "completedDate": "2024-09-18"
            },
            {
                "id": 4,
                "name": "Create user authentication system",
                "kanbanColumn": "To Do",
                "urgent": false,
                "targetDate": "2024-10-05",
                "assignedTo": "Diana Lee",
                "completedDate": ""
            },
            {
                "id": 5,
                "name": "Implement search functionality",
                "kanbanColumn": "Backlog",
                "urgent": false,
                "targetDate": "2024-10-20",
                "assignedTo": "",
                "completedDate": ""
            }
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
                }
            ]
            },
            "team": {
            "members": [
                {
                "id": 1,
                "name": "Alice Johnson",
                "role": "Project Manager"
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
                "name": "Diana Lee",
                "role": "Backend Developer",
                "activity": {
                    "completedTasks": 6,
                    "completeTasksInLast3Days": "2"
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
                "from": 3,
                "to": 2,
                "content": "Sure, I'll take a look at it this afternoon.",
                "timestamp": "2024-09-15T15:00:00Z",
                "markedRead": true
                },
                {
                "from": 4,
                "to": 1,
                "content": "Alice, do we have a timeline for the user authentication system?",
                "timestamp": "2024-09-16T09:15:00Z",
                "markedRead": false
                }
            ],
            "projectChatBoard": [
                {
                "author": 1,
                "summary": "Team Meeting",
                "content": "Team meeting scheduled for tomorrow at 10 AM.",
                "timestamp": "2024-09-17T16:00:00Z",
                "acknowledged": false
                },
                {
                "author": 2,
                "summary": "Design Update",
                "content": "Homepage mockup is ready for review. Please check and provide feedback.",
                "timestamp": "2024-09-18T11:30:00Z",
                "acknowledged": true
                },
                {
                "author": 4,
                "summary": "Backend Progress",
                "content": "Database optimization complete. Moving on to user authentication.",
                "timestamp": "2024-09-19T14:45:00Z",
                "acknowledged": false
                }
            ]
            },
            "risks": [
            {
                "id": 1,
                "userFlag": 3,
                "riskLevel": "Critical",
                "riskFactors": {
                "timeline": 5,
                "budget": 4,
                "dependencies": 5,
                "resources": 4,
                "complexity": 5,
                "total": 23
                }
            },
            {
                "id": 2,
                "userFlag": 2,
                "riskLevel": "Medium",
                "riskFactors": {
                "timeline": 3,
                "budget": 2,
                "dependencies": 3,
                "resources": 2,
                "complexity": 4,
                "total": 14
                }
            }
            ]
        },
        {
            "projectId": 2,
            "projectName": "Mobile App Development",
            "projectOwner": "David Lee",
            "projectStartDate": "2024-10-01",
            "projectTargetDate": "2025-03-31",
            "tasks": [
            {
                "id": 1,
                "name": "Create app wireframes",
                "kanbanColumn": "Done",
                "urgent": true,
                "targetDate": "2024-10-15",
                "assignedTo": "Emily Chen",
                "completedDate": "2024-10-14"
            },
            {
                "id": 2,
                "name": "Develop user authentication",
                "kanbanColumn": "In Progress",
                "urgent": false,
                "targetDate": "2024-11-01",
                "assignedTo": "Frank Wilson",
                "completedDate": ""
            },
            {
                "id": 3,
                "name": "Implement data synchronization",
                "kanbanColumn": "To Do",
                "urgent": true,
                "targetDate": "2024-11-15",
                "assignedTo": "Grace Kim",
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
                "id": 1,
                "name": "David Lee",
                "role": "Project Manager"
                },
                {
                "id": 2,
                "name": "Emily Chen",
                "role": "UI/UX Designer",
                "activity": {
                    "completedTasks": 7,
                    "completeTasksInLast3Days": "1"
                }
                },
                {
                "id": 3,
                "name": "Frank Wilson",
                "role": "Mobile Developer",
                "activity": {
                    "completedTasks": 5,
                    "completeTasksInLast3Days": "0"
                }
                },
                {
                "id": 4,
                "name": "Grace Kim",
                "role": "Backend Developer",
                "activity": {
                    "completedTasks": 3,
                    "completeTasksInLast3Days": "1"
                }
                }
            ]
            },
            "messages": {
            "directMessages": [
                {
                "from": 2,
                "to": 3,
                "content": "Wireframes are ready for review.",
                "timestamp": "2024-10-14T09:30:00Z",
                "markedRead": true
                },
                {
                "from": 3,
                "to": 4,
                "content": "Grace, when can we start integrating the backend APIs?",
                "timestamp": "2024-10-16T11:45:00Z",
                "markedRead": false
                }
            ],
            "projectChatBoard": [
                {
                "author": 1,
                "summary": "Project Kickoff",
                "content": "Great start everyone! Let's keep up the momentum.",
                "timestamp": "2024-10-02T10:00:00Z",
                "acknowledged": true,
                "important": true
                },
                {
                "author": 2,
                "summary": "Design Approval",
                "content": "App wireframes have been approved by the client.",
                "timestamp": "2024-10-15T14:20:00Z",
                "acknowledged": false,
                "important": false
                }
            ]
            },
            "risks": [
            {
                "id": 1,
                "userFlag": 2,
                "riskLevel": "Medium",
                "riskFactors": {
                "timeline": 3,
                "budget": 2,
                "dependencies": 4,
                "resources": 3,
                "complexity": 3,
                "total": 15
                }
            }
            ]
        },
        {
            "projectId": 3,
            "projectName": "E-commerce Platform Upgrade",
            "projectOwner": "Helen Park",
            "projectStartDate": "2024-11-01",
            "projectTargetDate": "2025-04-30",
            "tasks": [
            {
                "id": 1,
                "name": "Analyze current system",
                "kanbanColumn": "Done",
                "urgent": true,
                "targetDate": "2024-11-15",
                "assignedTo": "Ian Foster",
                "completedDate": "2024-11-14"
            },
            {
                "id": 2,
                "name": "Design new architecture",
                "kanbanColumn": "In Progress",
                "urgent": true,
                "targetDate": "2024-12-01",
                "assignedTo": "Julia Chang",
                "completedDate": ""
            },
            {
                "id": 3,
                "name": "Develop inventory management module",
                "kanbanColumn": "To Do",
                "urgent": false,
                "targetDate": "2024-12-15",
                "assignedTo": "Kevin Wong",
                "completedDate": ""
            },
            {
                "id": 4,
                "name": "Implement payment gateway integration",
                "kanbanColumn": "To Do",
                "urgent": true,
                "targetDate": "2024-12-31",
                "assignedTo": "Linda Martinez",
                "completedDate": ""
            },
            {
                "id": 5,
                "name": "Develop customer support ticketing system",
                "kanbanColumn": "Backlog",
                "urgent": false,
                "targetDate": "2025-01-15",
                "assignedTo": "",
                "completedDate": ""
            },
            {
                "id": 6,
                "name": "Perform security audit",
                "kanbanColumn": "Backlog",
                "urgent": true,
                "targetDate": "2025-02-01",
                "assignedTo": "",
                "completedDate": ""
            }
            ],
            "kanban": {
            "columns": [
                {
                "name": "Backlog",
                "color": "lightpink"
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
                "name": "Review",
                "color": "lavender"
                },
                {
                "name": "Testing",
                "color": "peachpuff"
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
                "id": 1,
                "name": "Helen Park",
                "role": "Project Manager"
                },
                {
                "id": 2,
                "name": "Ian Foster",
                "role": "Systems Analyst",
                "activity": {
                    "completedTasks": 6,
                    "completeTasksInLast3Days": "1"
                }
                },
                {
                "id": 3,
                "name": "Julia Chang",
                "role": "Software Architect",
                "activity": {
                    "completedTasks": 4,
                    "completeTasksInLast3Days": "0"
                }
                },
                {
                "id": 4,
                "name": "Kevin Wong",
                "role": "Backend Developer",
                "activity": {
                    "completedTasks": 2,
                    "completeTasksInLast3Days": "1"
                }
                },
                {
                "id": 5,
                "name": "Linda Martinez",
                "role": "Frontend Developer",
                "activity": {
                    "completedTasks": 3,
                    "completeTasksInLast3Days": "0"
                }
                }
            ]
            },
            "messages": {
            "directMessages": [
                {
                "from": 2,
                "to": 3,
                "content": "System analysis report is ready for your review.",
                "timestamp": "2024-11-15T16:45:00Z",
                "markedRead": false
                },
                {
                "from": 3,
                "to": 1,
                "content": "Helen, can we schedule a meeting to discuss the new architecture?",
                "timestamp": "2024-11-16T09:30:00Z",
                "markedRead": true
                },
                {
                "from": 4,
                "to": 5,
                "content": "Linda, I'll need your input on the frontend requirements for the inventory module.",
                "timestamp": "2024-11-17T11:20:00Z",
                "markedRead": false
                },
                {
                "from": 1,
                "to": 2,
                "content": "Great job on the system analysis, Ian. Let's discuss the findings in our next team meeting.",
                "timestamp": "2024-11-18T14:00:00Z",
                "markedRead": true
                }
            ],
            "projectChatBoard": [
                {
                "author": 1,
                "summary": "Project Kickoff",
                "content": "Welcome to the E-commerce Platform Upgrade project! Let's work together to deliver an outstanding solution.",
                "timestamp": "2024-11-02T09:00:00Z",
                "acknowledged": true
                },
                {
                "author": 2,
                "summary": "Analysis Complete",
                "content": "The current system analysis is complete. I've shared the report for review.",
                "timestamp": "2024-11-15T17:00:00Z",
                "acknowledged": false
                },
                {
                "author": 3,
                "summary": "Architecture Planning",
                "content": "I'll be working on the new architecture design. Feel free to share any ideas or concerns.",
                "timestamp": "2024-11-17T10:30:00Z",
                "acknowledged": false
                }
            ]
            },
            "risks": [
            {
                "id": 1,
                "userFlag": 1,
                "riskLevel": "High",
                "riskFactors": {
                "timeline": 4,
                "budget": 3,
                "dependencies": 5,
                "resources": 4,
                "complexity": 4,
                "total": 20
                }
            },
            {
                "id": 2,
                "userFlag": 3,
                "riskLevel": "Medium",
                "riskFactors": {
                "timeline": 3,
                "budget": 2,
                "dependencies": 4,
                "resources": 3,
                "complexity": 4,
                "total": 16
                }
            }
            ]
        },
        {
            "projectId": 4,
            "projectName": "AI-Powered Customer Service Chatbot",
            "projectOwner": "Michael Chen",
            "projectStartDate": "2024-12-01",
            "projectTargetDate": "2025-06-30",
            "tasks": [
            {
                "id": 1,
                "name": "Define chatbot requirements",
                "kanbanColumn": "Done",
                "urgent": true,
                "targetDate": "2024-12-15",
                "assignedTo": "Olivia Wilson",
                "completedDate": "2024-12-14"
            },
            {
                "id": 2,
                "name": "Design conversation flows",
                "kanbanColumn": "In Progress",
                "urgent": true,
                "targetDate": "2025-01-15",
                "assignedTo": "Paul Thompson",
                "completedDate": ""
            },
            {
                "id": 3,
                "name": "Develop NLP model",
                "kanbanColumn": "To Do",
                "urgent": false,
                "targetDate": "2025-02-28",
                "assignedTo": "Rachel Kim",
                "completedDate": ""
            },
            {
                "id": 4,
                "name": "Integrate with existing customer database",
                "kanbanColumn": "To Do",
                "urgent": true,
                "targetDate": "2025-03-31",
                "assignedTo": "Samuel Lee",
                "completedDate": ""
            },
            {
                "id": 5,
                "name": "Implement multi-language support",
                "kanbanColumn": "Backlog",
                "urgent": false,
                "targetDate": "2025-05-15",
                "assignedTo": "",
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
                "name": "To Do",
                "color": "lightyellow"
                },
                {
                "name": "In Progress",
                "color": "lightblue"
                },
                {
                "name": "Testing",
                "color": "peachpuff"
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
                "id": 1,
                "name": "Michael Chen",
                "role": "Project Manager"
                },
                {
                "id": 2,
                "name": "Olivia Wilson",
                "role": "Business Analyst",
                "activity": {
                    "completedTasks": 5,
                    "completeTasksInLast3Days": "1"
                }
                },
                {
                "id": 3,
                "name": "Paul Thompson",
                "role": "UX Designer",
                "activity": {
                    "completedTasks": 3,
                    "completeTasksInLast3Days": "0"
                }
                },
                {
                "id": 4,
                "name": "Rachel Kim",
                "role": "AI Engineer",
                "activity": {
                    "completedTasks": 2,
                    "completeTasksInLast3Days": "1"
                }
                },
                {
                "id": 5,
                "name": "Samuel Lee",
                "role": "Backend Developer",
                "activity": {
                    "completedTasks": 4,
                    "completeTasksInLast3Days": "0"
                }
                }
            ]
            },
            "messages": {
            "directMessages": [
                {
                "from": 2,
                "to": 1,
                "content": "Michael, the chatbot requirements document is ready for your review.",
                "timestamp": "2024-12-14T16:30:00Z",
                "markedRead": true
                },
                {
                "from": 1,
                "to": 3,
                "content": "Paul, how's the progress on the conversation flows?",
                "timestamp": "2024-12-20T11:15:00Z",
                "markedRead": false
                },
                {
                "from": 4,
                "to": 5,
                "content": "Samuel, can we discuss the integration points for the customer database next week?",
                "timestamp": "2024-12-22T14:45:00Z",
                "markedRead": false
                }
            ],
            "projectChatBoard": [
                {
                "author": 1,
                "summary": "Project Kickoff",
                "content": "Welcome to the AI-Powered Customer Service Chatbot project! Let's revolutionize our customer support.",
                "timestamp": "2024-12-02T10:00:00Z",
                "acknowledged": true
                },
                {
                "author": 2,
                "summary": "Requirements Finalized",
                "content": "The chatbot requirements have been finalized and shared with the team.",
                "timestamp": "2024-12-15T09:30:00Z",
                "acknowledged": false
                },
                {
                "author": 4,
                "summary": "AI Model Research",
                "content": "I've compiled a list of potential NLP models for our chatbot. We'll discuss in our next meeting.",
                "timestamp": "2024-12-18T15:20:00Z",
                "acknowledged": false
                }
            ]
            },
            "risks": [
            {
                "id": 1,
                "userFlag": 4,
                "riskLevel": "High",
                "riskFactors": {
                "timeline": 3,
                "budget": 2,
                "dependencies": 4,
                "resources": 3,
                "complexity": 5,
                "total": 17
                }
            }
            ]
        },
        {
            "projectId": 1,
            "projectName": "Website Redesign",
            "projectOwner": "Alice Johnson",
            "projectStartDate": "2024-09-01",
            "projectTargetDate": "2024-12-31",
            "tasks": [
            {
                "id": 1,
                "name": "Design homepage mockup",
                "kanbanColumn": "In Progress",
                "urgent": true,
                "targetDate": "2024-09-21",
                "assignedTo": "Bob Smith",
                "completedDate": ""
            },
            {
                "id": 2,
                "name": "Implement responsive layout",
                "kanbanColumn": "In Progress",
                "urgent": false,
                "targetDate": "2024-09-17",
                "assignedTo": "Charlie Brown",
                "completedDate": ""
            },
            {
                "id": 3,
                "name": "Optimize database queries",
                "kanbanColumn": "Done",
                "urgent": true,
                "targetDate": "2024-09-19",
                "assignedTo": "Bob Smith",
                "completedDate": "2024-09-18"
            },
            {
                "id": 4,
                "name": "Create user authentication system",
                "kanbanColumn": "To Do",
                "urgent": false,
                "targetDate": "2024-10-05",
                "assignedTo": "Diana Lee",
                "completedDate": ""
            },
            {
                "id": 5,
                "name": "Implement search functionality",
                "kanbanColumn": "Backlog",
                "urgent": false,
                "targetDate": "2024-10-20",
                "assignedTo": "",
                "completedDate": ""
            }
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
                }
            ]
            },
            "team": {
            "members": [
                {
                "id": 1,
                "name": "Alice Johnson",
                "role": "Project Manager"
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
                "name": "Diana Lee",
                "role": "Backend Developer",
                "activity": {
                    "completedTasks": 6,
                    "completeTasksInLast3Days": "2"
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
                "from": 3,
                "to": 2,
                "content": "Sure, I'll take a look at it this afternoon.",
                "timestamp": "2024-09-15T15:00:00Z",
                "markedRead": true
                },
                {
                "from": 4,
                "to": 1,
                "content": "Alice, do we have a timeline for the user authentication system?",
                "timestamp": "2024-09-16T09:15:00Z",
                "markedRead": false
                }
            ],
            "projectChatBoard": [
                {
                "author": 1,
                "summary": "Team Meeting",
                "content": "Team meeting scheduled for tomorrow at 10 AM.",
                "timestamp": "2024-09-17T16:00:00Z",
                "acknowledged": false
                },
                {
                "author": 2,
                "summary": "Design Update",
                "content": "Homepage mockup is ready for review. Please check and provide feedback.",
                "timestamp": "2024-09-18T11:30:00Z",
                "acknowledged": true
                },
                {
                "author": 4,
                "summary": "Backend Progress",
                "content": "Database optimization complete. Moving on to user authentication.",
                "timestamp": "2024-09-19T14:45:00Z",
                "acknowledged": false
                }
            ]
            },
            "risks": [
            {
                "id": 1,
                "userFlag": 3,
                "riskLevel": "Critical",
                "riskFactors": {
                "timeline": 5,
                "budget": 4,
                "dependencies": 5,
                "resources": 4,
                "complexity": 5,
                "total": 23
                }
            },
            {
                "id": 2,
                "userFlag": 2,
                "riskLevel": "Medium",
                "riskFactors": {
                "timeline": 3,
                "budget": 2,
                "dependencies": 3,
                "resources": 2,
                "complexity": 4,
                "total": 14
                }
            }
            ]
        },
        {
            "projectId": 2,
            "projectName": "Mobile App Development",
            "projectOwner": "David Lee",
            "projectStartDate": "2024-10-01",
            "projectTargetDate": "2025-03-31",
            "tasks": [
            {
                "id": 1,
                "name": "Create app wireframes",
                "kanbanColumn": "Done",
                "urgent": true,
                "targetDate": "2024-10-15",
                "assignedTo": "Emily Chen",
                "completedDate": "2024-10-14"
            },
            {
                "id": 2,
                "name": "Develop user authentication",
                "kanbanColumn": "In Progress",
                "urgent": false,
                "targetDate": "2024-11-01",
                "assignedTo": "Frank Wilson",
                "completedDate": ""
            },
            {
                "id": 3,
                "name": "Implement data synchronization",
                "kanbanColumn": "To Do",
                "urgent": true,
                "targetDate": "2024-11-15",
                "assignedTo": "Grace Kim",
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
                "id": 1,
                "name": "David Lee",
                "role": "Project Manager"
                },
                {
                "id": 2,
                "name": "Emily Chen",
                "role": "UI/UX Designer",
                "activity": {
                    "completedTasks": 7,
                    "completeTasksInLast3Days": "1"
                }
                },
                {
                "id": 3,
                "name": "Frank Wilson",
                "role": "Mobile Developer",
                "activity": {
                    "completedTasks": 5,
                    "completeTasksInLast3Days": "0"
                }
                },
                {
                "id": 4,
                "name": "Grace Kim",
                "role": "Backend Developer",
                "activity": {
                    "completedTasks": 3,
                    "completeTasksInLast3Days": "1"
                }
                }
            ]
            },
            "messages": {
            "directMessages": [
                {
                "from": 2,
                "to": 3,
                "content": "Wireframes are ready for review.",
                "timestamp": "2024-10-14T09:30:00Z",
                "markedRead": true
                },
                {
                "from": 3,
                "to": 4,
                "content": "Grace, when can we start integrating the backend APIs?",
                "timestamp": "2024-10-16T11:45:00Z",
                "markedRead": false
                }
            ],
            "projectChatBoard": [
                {
                "author": 1,
                "summary": "Project Kickoff",
                "content": "Great start everyone! Let's keep up the momentum.",
                "timestamp": "2024-10-02T10:00:00Z",
                "acknowledged": true
                },
                {
                "author": 2,
                "summary": "Design Approval",
                "content": "App wireframes have been approved by the client.",
                "timestamp": "2024-10-15T14:20:00Z",
                "acknowledged": false
                }
            ]
            },
            "risks": [
            {
                "id": 1,
                "userFlag": 2,
                "riskLevel": "Medium",
                "riskFactors": {
                "timeline": 3,
                "budget": 2,
                "dependencies": 4,
                "resources": 3,
                "complexity": 3,
                "total": 15
                }
            }
            ]
        },
        {
            "projectId": 3,
            "projectName": "E-commerce Platform Upgrade",
            "projectOwner": "Helen Park",
            "projectStartDate": "2024-11-01",
            "projectTargetDate": "2025-04-30",
            "tasks": [
            {
                "id": 1,
                "name": "Analyze current system",
                "kanbanColumn": "Done",
                "urgent": true,
                "targetDate": "2024-11-15",
                "assignedTo": "Ian Foster",
                "completedDate": "2024-11-14"
            },
            {
                "id": 2,
                "name": "Design new architecture",
                "kanbanColumn": "In Progress",
                "urgent": true,
                "targetDate": "2024-12-01",
                "assignedTo": "Julia Chang",
                "completedDate": ""
            },
            {
                "id": 3,
                "name": "Develop inventory management module",
                "kanbanColumn": "To Do",
                "urgent": false,
                "targetDate": "2024-12-15",
                "assignedTo": "Kevin Wong",
                "completedDate": ""
            },
            {
                "id": 4,
                "name": "Implement payment gateway integration",
                "kanbanColumn": "To Do",
                "urgent": true,
                "targetDate": "2024-12-31",
                "assignedTo": "Linda Martinez",
                "completedDate": ""
            },
            {
                "id": 5,
                "name": "Develop customer support ticketing system",
                "kanbanColumn": "Backlog",
                "urgent": false,
                "targetDate": "2025-01-15",
                "assignedTo": "",
                "completedDate": ""
            },
            {
                "id": 6,
                "name": "Perform security audit",
                "kanbanColumn": "Backlog",
                "urgent": true,
                "targetDate": "2025-02-01",
                "assignedTo": "",
                "completedDate": ""
            }
            ],
            "kanban": {
            "columns": [
                {
                "name": "Backlog",
                "color": "lightpink"
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
                "name": "Review",
                "color": "lavender"
                },
                {
                "name": "Testing",
                "color": "peachpuff"
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
                "id": 1,
                "name": "Helen Park",
                "role": "Project Manager"
                },
                {
                "id": 2,
                "name": "Ian Foster",
                "role": "Systems Analyst",
                "activity": {
                    "completedTasks": 6,
                    "completeTasksInLast3Days": "1"
                }
                },
                {
                "id": 3,
                "name": "Julia Chang",
                "role": "Software Architect",
                "activity": {
                    "completedTasks": 4,
                    "completeTasksInLast3Days": "0"
                }
                },
                {
                "id": 4,
                "name": "Kevin Wong",
                "role": "Backend Developer",
                "activity": {
                    "completedTasks": 2,
                    "completeTasksInLast3Days": "1"
                }
                },
                {
                "id": 5,
                "name": "Linda Martinez",
                "role": "Frontend Developer",
                "activity": {
                    "completedTasks": 3,
                    "completeTasksInLast3Days": "0"
                }
                }
            ]
            },
            "messages": {
            "directMessages": [
                {
                "from": 2,
                "to": 3,
                "content": "System analysis report is ready for your review.",
                "timestamp": "2024-11-15T16:45:00Z",
                "markedRead": false
                },
                {
                "from": 3,
                "to": 1,
                "content": "Helen, can we schedule a meeting to discuss the new architecture?",
                "timestamp": "2024-11-16T09:30:00Z",
                "markedRead": true
                },
                {
                "from": 4,
                "to": 5,
                "content": "Linda, I'll need your input on the frontend requirements for the inventory module.",
                "timestamp": "2024-11-17T11:20:00Z",
                "markedRead": false
                },
                {
                "from": 1,
                "to": 2,
                "content": "Great job on the system analysis, Ian. Let's discuss the findings in our next team meeting.",
                "timestamp": "2024-11-18T14:00:00Z",
                "markedRead": true
                }
            ],
            "projectChatBoard": [
                {
                "author": 1,
                "summary": "Project Kickoff",
                "content": "Welcome to the E-commerce Platform Upgrade project! Let's work together to deliver an outstanding solution.",
                "timestamp": "2024-11-02T09:00:00Z",
                "acknowledged": true
                },
                {
                "author": 2,
                "summary": "Analysis Complete",
                "content": "The current system analysis is complete. I've shared the report for review.",
                "timestamp": "2024-11-15T17:00:00Z",
                "acknowledged": false
                },
                {
                "author": 3,
                "summary": "Architecture Planning",
                "content": "I'll be working on the new architecture design. Feel free to share any ideas or concerns.",
                "timestamp": "2024-11-17T10:30:00Z",
                "acknowledged": false
                }
            ]
            },
            "risks": [
            {
                "id": 1,
                "userFlag": 1,
                "riskLevel": "High",
                "riskFactors": {
                "timeline": 4,
                "budget": 3,
                "dependencies": 5,
                "resources": 4,
                "complexity": 4,
                "total": 20
                }
            },
            {
                "id": 2,
                "userFlag": 3,
                "riskLevel": "Medium",
                "riskFactors": {
                "timeline": 3,
                "budget": 2,
                "dependencies": 4,
                "resources": 3,
                "complexity": 4,
                "total": 16
                }
            }
            ]
        },
        {
            "projectId": 4,
            "projectName": "AI-Powered Customer Service Chatbot",
            "projectOwner": "Michael Chen",
            "projectStartDate": "2024-12-01",
            "projectTargetDate": "2025-06-30",
            "tasks": [
            {
                "id": 1,
                "name": "Define chatbot requirements",
                "kanbanColumn": "Done",
                "urgent": true,
                "targetDate": "2024-12-15",
                "assignedTo": "Olivia Wilson",
                "completedDate": "2024-12-14"
            },
            {
                "id": 2,
                "name": "Design conversation flows",
                "kanbanColumn": "In Progress",
                "urgent": true,
                "targetDate": "2025-01-15",
                "assignedTo": "Paul Thompson",
                "completedDate": ""
            },
            {
                "id": 3,
                "name": "Develop NLP model",
                "kanbanColumn": "To Do",
                "urgent": false,
                "targetDate": "2025-02-28",
                "assignedTo": "Rachel Kim",
                "completedDate": ""
            },
            {
                "id": 4,
                "name": "Integrate with existing customer database",
                "kanbanColumn": "To Do",
                "urgent": true,
                "targetDate": "2025-03-31",
                "assignedTo": "Samuel Lee",
                "completedDate": ""
            },
            {
                "id": 5,
                "name": "Implement multi-language support",
                "kanbanColumn": "Backlog",
                "urgent": false,
                "targetDate": "2025-05-15",
                "assignedTo": "",
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
                "name": "To Do",
                "color": "lightyellow"
                },
                {
                "name": "In Progress",
                "color": "lightblue"
                },
                {
                "name": "Testing",
                "color": "peachpuff"
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
                "id": 1,
                "name": "Michael Chen",
                "role": "Project Manager"
                },
                {
                "id": 2,
                "name": "Olivia Wilson",
                "role": "Business Analyst",
                "activity": {
                    "completedTasks": 5,
                    "completeTasksInLast3Days": "1"
                }
                },
                {
                "id": 3,
                "name": "Paul Thompson",
                "role": "UX Designer",
                "activity": {
                    "completedTasks": 3,
                    "completeTasksInLast3Days": "0"
                }
                },
                {
                "id": 4,
                "name": "Rachel Kim",
                "role": "AI Engineer",
                "activity": {
                    "completedTasks": 2,
                    "completeTasksInLast3Days": "1"
                }
                },
                {
                "id": 5,
                "name": "Samuel Lee",
                "role": "Backend Developer",
                "activity": {
                    "completedTasks": 4,
                    "completeTasksInLast3Days": "0"
                }
                }
            ]
            },
            "messages": {
            "directMessages": [
                {
                "from": 2,
                "to": 1,
                "content": "Michael, the chatbot requirements document is ready for your review.",
                "timestamp": "2024-12-14T16:30:00Z",
                "markedRead": true
                },
                {
                "from": 1,
                "to": 3,
                "content": "Paul, how's the progress on the conversation flows?",
                "timestamp": "2024-12-20T11:15:00Z",
                "markedRead": false
                },
                {
                "from": 4,
                "to": 5,
                "content": "Samuel, can we discuss the integration points for the customer database next week?",
                "timestamp": "2024-12-22T14:45:00Z",
                "markedRead": false
                }
            ],
            "projectChatBoard": [
                {
                "author": 1,
                "summary": "Project Kickoff",
                "content": "Welcome to the AI-Powered Customer Service Chatbot project! Let's revolutionize our customer support.",
                "timestamp": "2024-12-02T10:00:00Z",
                "acknowledged": true
                },
                {
                "author": 2,
                "summary": "Requirements Finalized",
                "content": "The chatbot requirements have been finalized and shared with the team.",
                "timestamp": "2024-12-15T09:30:00Z",
                "acknowledged": false
                },
                {
                "author": 4,
                "summary": "AI Model Research",
                "content": "I've compiled a list of potential NLP models for our chatbot. We'll discuss in our next meeting.",
                "timestamp": "2024-12-18T15:20:00Z",
                "acknowledged": false
                }
            ]
            },
            "risks": [
            {
                "id": 1,
                "userFlag": 4,
                "riskLevel": "High",
                "riskFactors": {
                "timeline": 3,
                "budget": 2,
                "dependencies": 4,
                "resources": 3,
                "complexity": 5,
                "total": 17
                }
            }
            ]
        },
        {
            "projectId": 1,
            "projectName": "Website Redesign",
            "projectOwner": "Alice Johnson",
            "projectStartDate": "2024-09-01",
            "projectTargetDate": "2024-12-31",
            "tasks": [
            {
                "id": 1,
                "name": "Design homepage mockup",
                "kanbanColumn": "In Progress",
                "urgent": true,
                "targetDate": "2024-09-21",
                "assignedTo": "Bob Smith",
                "completedDate": ""
            },
            {
                "id": 2,
                "name": "Implement responsive layout",
                "kanbanColumn": "In Progress",
                "urgent": false,
                "targetDate": "2024-09-17",
                "assignedTo": "Charlie Brown",
                "completedDate": ""
            },
            {
                "id": 3,
                "name": "Optimize database queries",
                "kanbanColumn": "Done",
                "urgent": true,
                "targetDate": "2024-09-19",
                "assignedTo": "Bob Smith",
                "completedDate": "2024-09-18"
            },
            {
                "id": 4,
                "name": "Create user authentication system",
                "kanbanColumn": "To Do",
                "urgent": false,
                "targetDate": "2024-10-05",
                "assignedTo": "Diana Lee",
                "completedDate": ""
            },
            {
                "id": 5,
                "name": "Implement search functionality",
                "kanbanColumn": "Backlog",
                "urgent": false,
                "targetDate": "2024-10-20",
                "assignedTo": "",
                "completedDate": ""
            }
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
                }
            ]
            },
            "team": {
            "members": [
                {
                "id": 1,
                "name": "Alice Johnson",
                "role": "Project Manager"
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
                "name": "Diana Lee",
                "role": "Backend Developer",
                "activity": {
                    "completedTasks": 6,
                    "completeTasksInLast3Days": "2"
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
                "from": 3,
                "to": 2,
                "content": "Sure, I'll take a look at it this afternoon.",
                "timestamp": "2024-09-15T15:00:00Z",
                "markedRead": true
                },
                {
                "from": 4,
                "to": 1,
                "content": "Alice, do we have a timeline for the user authentication system?",
                "timestamp": "2024-09-16T09:15:00Z",
                "markedRead": false
                }
            ],
            "projectChatBoard": [
                {
                "author": 1,
                "summary": "Team Meeting",
                "content": "Team meeting scheduled for tomorrow at 10 AM.",
                "timestamp": "2024-09-17T16:00:00Z",
                "acknowledged": false
                },
                {
                "author": 2,
                "summary": "Design Update",
                "content": "Homepage mockup is ready for review. Please check and provide feedback.",
                "timestamp": "2024-09-18T11:30:00Z",
                "acknowledged": true
                },
                {
                "author": 4,
                "summary": "Backend Progress",
                "content": "Database optimization complete. Moving on to user authentication.",
                "timestamp": "2024-09-19T14:45:00Z",
                "acknowledged": false
                }
            ]
            },
            "risks": [
            {
                "id": 1,
                "userFlag": 3,
                "riskLevel": "Critical",
                "riskFactors": {
                "timeline": 5,
                "budget": 4,
                "dependencies": 5,
                "resources": 4,
                "complexity": 5,
                "total": 23
                }
            },
            {
                "id": 2,
                "userFlag": 2,
                "riskLevel": "Medium",
                "riskFactors": {
                "timeline": 3,
                "budget": 2,
                "dependencies": 3,
                "resources": 2,
                "complexity": 4,
                "total": 14
                }
            }
            ]
        },
        {
            "projectId": 2,
            "projectName": "Mobile App Development",
            "projectOwner": "David Lee",
            "projectStartDate": "2024-10-01",
            "projectTargetDate": "2025-03-31",
            "tasks": [
            {
                "id": 1,
                "name": "Create app wireframes",
                "kanbanColumn": "Done",
                "urgent": true,
                "targetDate": "2024-10-15",
                "assignedTo": "Emily Chen",
                "completedDate": "2024-10-14"
            },
            {
                "id": 2,
                "name": "Develop user authentication",
                "kanbanColumn": "In Progress",
                "urgent": false,
                "targetDate": "2024-11-01",
                "assignedTo": "Frank Wilson",
                "completedDate": ""
            },
            {
                "id": 3,
                "name": "Implement data synchronization",
                "kanbanColumn": "To Do",
                "urgent": true,
                "targetDate": "2024-11-15",
                "assignedTo": "Grace Kim",
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
                "id": 1,
                "name": "David Lee",
                "role": "Project Manager"
                },
                {
                "id": 2,
                "name": "Emily Chen",
                "role": "UI/UX Designer",
                "activity": {
                    "completedTasks": 7,
                    "completeTasksInLast3Days": "1"
                }
                },
                {
                "id": 3,
                "name": "Frank Wilson",
                "role": "Mobile Developer",
                "activity": {
                    "completedTasks": 5,
                    "completeTasksInLast3Days": "0"
                }
                },
                {
                "id": 4,
                "name": "Grace Kim",
                "role": "Backend Developer",
                "activity": {
                    "completedTasks": 3,
                    "completeTasksInLast3Days": "1"
                }
                }
            ]
            },
            "messages": {
            "directMessages": [
                {
                "from": 2,
                "to": 3,
                "content": "Wireframes are ready for review.",
                "timestamp": "2024-10-14T09:30:00Z",
                "markedRead": true
                },
                {
                "from": 3,
                "to": 4,
                "content": "Grace, when can we start integrating the backend APIs?",
                "timestamp": "2024-10-16T11:45:00Z",
                "markedRead": false
                }
            ],
            "projectChatBoard": [
                {
                "author": 1,
                "summary": "Project Kickoff",
                "content": "Great start everyone! Let's keep up the momentum.",
                "timestamp": "2024-10-02T10:00:00Z",
                "acknowledged": true
                },
                {
                "author": 2,
                "summary": "Design Approval",
                "content": "App wireframes have been approved by the client.",
                "timestamp": "2024-10-15T14:20:00Z",
                "acknowledged": false
                }
            ]
            },
            "risks": [
            {
                "id": 1,
                "userFlag": 2,
                "riskLevel": "Medium",
                "riskFactors": {
                "timeline": 3,
                "budget": 2,
                "dependencies": 4,
                "resources": 3,
                "complexity": 3,
                "total": 15
                }
            }
            ]
        },
        {
            "projectId": 3,
            "projectName": "E-commerce Platform Upgrade",
            "projectOwner": "Helen Park",
            "projectStartDate": "2024-11-01",
            "projectTargetDate": "2025-04-30",
            "tasks": [
            {
                "id": 1,
                "name": "Analyze current system",
                "kanbanColumn": "Done",
                "urgent": true,
                "targetDate": "2024-11-15",
                "assignedTo": "Ian Foster",
                "completedDate": "2024-11-14"
            },
            {
                "id": 2,
                "name": "Design new architecture",
                "kanbanColumn": "In Progress",
                "urgent": true,
                "targetDate": "2024-12-01",
                "assignedTo": "Julia Chang",
                "completedDate": ""
            },
            {
                "id": 3,
                "name": "Develop inventory management module",
                "kanbanColumn": "To Do",
                "urgent": false,
                "targetDate": "2024-12-15",
                "assignedTo": "Kevin Wong",
                "completedDate": ""
            },
            {
                "id": 4,
                "name": "Implement payment gateway integration",
                "kanbanColumn": "To Do",
                "urgent": true,
                "targetDate": "2024-12-31",
                "assignedTo": "Linda Martinez",
                "completedDate": ""
            },
            {
                "id": 5,
                "name": "Develop customer support ticketing system",
                "kanbanColumn": "Backlog",
                "urgent": false,
                "targetDate": "2025-01-15",
                "assignedTo": "",
                "completedDate": ""
            },
            {
                "id": 6,
                "name": "Perform security audit",
                "kanbanColumn": "Backlog",
                "urgent": true,
                "targetDate": "2025-02-01",
                "assignedTo": "",
                "completedDate": ""
            }
            ],
            "kanban": {
            "columns": [
                {
                "name": "Backlog",
                "color": "lightpink"
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
                "name": "Review",
                "color": "lavender"
                },
                {
                "name": "Testing",
                "color": "peachpuff"
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
                "id": 1,
                "name": "Helen Park",
                "role": "Project Manager"
                },
                {
                "id": 2,
                "name": "Ian Foster",
                "role": "Systems Analyst",
                "activity": {
                    "completedTasks": 6,
                    "completeTasksInLast3Days": "1"
                }
                },
                {
                "id": 3,
                "name": "Julia Chang",
                "role": "Software Architect",
                "activity": {
                    "completedTasks": 4,
                    "completeTasksInLast3Days": "0"
                }
                },
                {
                "id": 4,
                "name": "Kevin Wong",
                "role": "Backend Developer",
                "activity": {
                    "completedTasks": 2,
                    "completeTasksInLast3Days": "1"
                }
                },
                {
                "id": 5,
                "name": "Linda Martinez",
                "role": "Frontend Developer",
                "activity": {
                    "completedTasks": 3,
                    "completeTasksInLast3Days": "0"
                }
                }
            ]
            },
            "messages": {
            "directMessages": [
                {
                "from": 2,
                "to": 3,
                "content": "System analysis report is ready for your review.",
                "timestamp": "2024-11-15T16:45:00Z",
                "markedRead": false
                },
                {
                "from": 3,
                "to": 1,
                "content": "Helen, can we schedule a meeting to discuss the new architecture?",
                "timestamp": "2024-11-16T09:30:00Z",
                "markedRead": true
                },
                {
                "from": 4,
                "to": 5,
                "content": "Linda, I'll need your input on the frontend requirements for the inventory module.",
                "timestamp": "2024-11-17T11:20:00Z",
                "markedRead": false
                },
                {
                "from": 1,
                "to": 2,
                "content": "Great job on the system analysis, Ian. Let's discuss the findings in our next team meeting.",
                "timestamp": "2024-11-18T14:00:00Z",
                "markedRead": true
                }
            ],
            "projectChatBoard": [
                {
                "author": 1,
                "summary": "Project Kickoff",
                "content": "Welcome to the E-commerce Platform Upgrade project! Let's work together to deliver an outstanding solution.",
                "timestamp": "2024-11-02T09:00:00Z",
                "acknowledged": true
                },
                {
                "author": 2,
                "summary": "Analysis Complete",
                "content": "The current system analysis is complete. I've shared the report for review.",
                "timestamp": "2024-11-15T17:00:00Z",
                "acknowledged": false
                },
                {
                "author": 3,
                "summary": "Architecture Planning",
                "content": "I'll be working on the new architecture design. Feel free to share any ideas or concerns.",
                "timestamp": "2024-11-17T10:30:00Z",
                "acknowledged": false
                }
            ]
            },
            "risks": [
            {
                "id": 1,
                "userFlag": 1,
                "riskLevel": "High",
                "riskFactors": {
                "timeline": 4,
                "budget": 3,
                "dependencies": 5,
                "resources": 4,
                "complexity": 4,
                "total": 20
                }
            },
            {
                "id": 2,
                "userFlag": 3,
                "riskLevel": "Medium",
                "riskFactors": {
                "timeline": 3,
                "budget": 2,
                "dependencies": 4,
                "resources": 3,
                "complexity": 4,
                "total": 16
                }
            }
            ]
        },
        {
            "projectId": 4,
            "projectName": "AI-Powered Customer Service Chatbot",
            "projectOwner": "Michael Chen",
            "projectStartDate": "2024-12-01",
            "projectTargetDate": "2025-06-30",
            "tasks": [
            {
                "id": 1,
                "name": "Define chatbot requirements",
                "kanbanColumn": "Done",
                "urgent": true,
                "targetDate": "2024-12-15",
                "assignedTo": "Olivia Wilson",
                "completedDate": "2024-12-14"
            },
            {
                "id": 2,
                "name": "Design conversation flows",
                "kanbanColumn": "In Progress",
                "urgent": true,
                "targetDate": "2025-01-15",
                "assignedTo": "Paul Thompson",
                "completedDate": ""
            },
            {
                "id": 3,
                "name": "Develop NLP model",
                "kanbanColumn": "To Do",
                "urgent": false,
                "targetDate": "2025-02-28",
                "assignedTo": "Rachel Kim",
                "completedDate": ""
            },
            {
                "id": 4,
                "name": "Integrate with existing customer database",
                "kanbanColumn": "To Do",
                "urgent": true,
                "targetDate": "2025-03-31",
                "assignedTo": "Samuel Lee",
                "completedDate": ""
            },
            {
                "id": 5,
                "name": "Implement multi-language support",
                "kanbanColumn": "Backlog",
                "urgent": false,
                "targetDate": "2025-05-15",
                "assignedTo": "",
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
                "name": "To Do",
                "color": "lightyellow"
                },
                {
                "name": "In Progress",
                "color": "lightblue"
                },
                {
                "name": "Testing",
                "color": "peachpuff"
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
                "id": 1,
                "name": "Michael Chen",
                "role": "Project Manager"
                },
                {
                "id": 2,
                "name": "Olivia Wilson",
                "role": "Business Analyst",
                "activity": {
                    "completedTasks": 5,
                    "completeTasksInLast3Days": "1"
                }
                },
                {
                "id": 3,
                "name": "Paul Thompson",
                "role": "UX Designer",
                "activity": {
                    "completedTasks": 3,
                    "completeTasksInLast3Days": "0"
                }
                },
                {
                "id": 4,
                "name": "Rachel Kim",
                "role": "AI Engineer",
                "activity": {
                    "completedTasks": 2,
                    "completeTasksInLast3Days": "1"
                }
                },
                {
                "id": 5,
                "name": "Samuel Lee",
                "role": "Backend Developer",
                "activity": {
                    "completedTasks": 4,
                    "completeTasksInLast3Days": "0"
                }
                }
            ]
            },
            "messages": {
            "directMessages": [
                {
                "from": 2,
                "to": 1,
                "content": "Michael, the chatbot requirements document is ready for your review.",
                "timestamp": "2024-12-14T16:30:00Z",
                "markedRead": true
                },
                {
                "from": 1,
                "to": 3,
                "content": "Paul, how's the progress on the conversation flows?",
                "timestamp": "2024-12-20T11:15:00Z",
                "markedRead": false
                },
                {
                "from": 4,
                "to": 5,
                "content": "Samuel, can we discuss the integration points for the customer database next week?",
                "timestamp": "2024-12-22T14:45:00Z",
                "markedRead": false
                }
            ],
            "projectChatBoard": [
                {
                "author": 1,
                "summary": "Project Kickoff",
                "content": "Welcome to the AI-Powered Customer Service Chatbot project! Let's revolutionize our customer support.",
                "timestamp": "2024-12-02T10:00:00Z",
                "acknowledged": true
                },
                {
                "author": 2,
                "summary": "Requirements Finalized",
                "content": "The chatbot requirements have been finalized and shared with the team.",
                "timestamp": "2024-12-15T09:30:00Z",
                "acknowledged": false
                },
                {
                "author": 4,
                "summary": "AI Model Research",
                "content": "I've compiled a list of potential NLP models for our chatbot. We'll discuss in our next meeting.",
                "timestamp": "2024-12-18T15:20:00Z",
                "acknowledged": false
                }
            ]
            },
            "risks": [
            {
                "id": 1,
                "userFlag": 4,
                "riskLevel": "High",
                "riskFactors": {
                "timeline": 3,
                "budget": 2,
                "dependencies": 4,
                "resources": 3,
                "complexity": 5,
                "total": 17
                }
            }
            ]
        },
        {
            "projectId": 1,
            "projectName": "Website Redesign",
            "projectOwner": "Alice Johnson",
            "projectStartDate": "2024-09-01",
            "projectTargetDate": "2024-12-31",
            "tasks": [
            {
                "id": 1,
                "name": "Design homepage mockup",
                "kanbanColumn": "In Progress",
                "urgent": true,
                "targetDate": "2024-09-21",
                "assignedTo": "Bob Smith",
                "completedDate": ""
            },
            {
                "id": 2,
                "name": "Implement responsive layout",
                "kanbanColumn": "In Progress",
                "urgent": false,
                "targetDate": "2024-09-17",
                "assignedTo": "Charlie Brown",
                "completedDate": ""
            },
            {
                "id": 3,
                "name": "Optimize database queries",
                "kanbanColumn": "Done",
                "urgent": true,
                "targetDate": "2024-09-19",
                "assignedTo": "Bob Smith",
                "completedDate": "2024-09-18"
            },
            {
                "id": 4,
                "name": "Create user authentication system",
                "kanbanColumn": "To Do",
                "urgent": false,
                "targetDate": "2024-10-05",
                "assignedTo": "Diana Lee",
                "completedDate": ""
            },
            {
                "id": 5,
                "name": "Implement search functionality",
                "kanbanColumn": "Backlog",
                "urgent": false,
                "targetDate": "2024-10-20",
                "assignedTo": "",
                "completedDate": ""
            }
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
                }
            ]
            },
            "team": {
            "members": [
                {
                "id": 1,
                "name": "Alice Johnson",
                "role": "Project Manager"
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
                "name": "Diana Lee",
                "role": "Backend Developer",
                "activity": {
                    "completedTasks": 6,
                    "completeTasksInLast3Days": "2"
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
                "from": 3,
                "to": 2,
                "content": "Sure, I'll take a look at it this afternoon.",
                "timestamp": "2024-09-15T15:00:00Z",
                "markedRead": true
                },
                {
                "from": 4,
                "to": 1,
                "content": "Alice, do we have a timeline for the user authentication system?",
                "timestamp": "2024-09-16T09:15:00Z",
                "markedRead": false
                }
            ],
            "projectChatBoard": [
                {
                "author": 1,
                "summary": "Team Meeting",
                "content": "Team meeting scheduled for tomorrow at 10 AM.",
                "timestamp": "2024-09-17T16:00:00Z",
                "acknowledged": false
                },
                {
                "author": 2,
                "summary": "Design Update",
                "content": "Homepage mockup is ready for review. Please check and provide feedback.",
                "timestamp": "2024-09-18T11:30:00Z",
                "acknowledged": true
                },
                {
                "author": 4,
                "summary": "Backend Progress",
                "content": "Database optimization complete. Moving on to user authentication.",
                "timestamp": "2024-09-19T14:45:00Z",
                "acknowledged": false
                }
            ]
            },
            "risks": [
            {
                "id": 1,
                "userFlag": 3,
                "riskLevel": "Critical",
                "riskFactors": {
                "timeline": 5,
                "budget": 4,
                "dependencies": 5,
                "resources": 4,
                "complexity": 5,
                "total": 23
                }
            },
            {
                "id": 2,
                "userFlag": 2,
                "riskLevel": "Medium",
                "riskFactors": {
                "timeline": 3,
                "budget": 2,
                "dependencies": 3,
                "resources": 2,
                "complexity": 4,
                "total": 14
                }
            }
            ]
        },
        {
            "projectId": 2,
            "projectName": "Mobile App Development",
            "projectOwner": "David Lee",
            "projectStartDate": "2024-10-01",
            "projectTargetDate": "2025-03-31",
            "tasks": [
            {
                "id": 1,
                "name": "Create app wireframes",
                "kanbanColumn": "Done",
                "urgent": true,
                "targetDate": "2024-10-15",
                "assignedTo": "Emily Chen",
                "completedDate": "2024-10-14"
            },
            {
                "id": 2,
                "name": "Develop user authentication",
                "kanbanColumn": "In Progress",
                "urgent": false,
                "targetDate": "2024-11-01",
                "assignedTo": "Frank Wilson",
                "completedDate": ""
            },
            {
                "id": 3,
                "name": "Implement data synchronization",
                "kanbanColumn": "To Do",
                "urgent": true,
                "targetDate": "2024-11-15",
                "assignedTo": "Grace Kim",
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
                "id": 1,
                "name": "David Lee",
                "role": "Project Manager"
                },
                {
                "id": 2,
                "name": "Emily Chen",
                "role": "UI/UX Designer",
                "activity": {
                    "completedTasks": 7,
                    "completeTasksInLast3Days": "1"
                }
                },
                {
                "id": 3,
                "name": "Frank Wilson",
                "role": "Mobile Developer",
                "activity": {
                    "completedTasks": 5,
                    "completeTasksInLast3Days": "0"
                }
                },
                {
                "id": 4,
                "name": "Grace Kim",
                "role": "Backend Developer",
                "activity": {
                    "completedTasks": 3,
                    "completeTasksInLast3Days": "1"
                }
                }
            ]
            },
            "messages": {
            "directMessages": [
                {
                "from": 2,
                "to": 3,
                "content": "Wireframes are ready for review.",
                "timestamp": "2024-10-14T09:30:00Z",
                "markedRead": true
                },
                {
                "from": 3,
                "to": 4,
                "content": "Grace, when can we start integrating the backend APIs?",
                "timestamp": "2024-10-16T11:45:00Z",
                "markedRead": false
                }
            ],
            "projectChatBoard": [
                {
                "author": 1,
                "summary": "Project Kickoff",
                "content": "Great start everyone! Let's keep up the momentum.",
                "timestamp": "2024-10-02T10:00:00Z",
                "acknowledged": true
                },
                {
                "author": 2,
                "summary": "Design Approval",
                "content": "App wireframes have been approved by the client.",
                "timestamp": "2024-10-15T14:20:00Z",
                "acknowledged": false
                }
            ]
            },
            "risks": [
            {
                "id": 1,
                "userFlag": 2,
                "riskLevel": "Medium",
                "riskFactors": {
                "timeline": 3,
                "budget": 2,
                "dependencies": 4,
                "resources": 3,
                "complexity": 3,
                "total": 15
                }
            }
            ]
        },
        {
            "projectId": 3,
            "projectName": "E-commerce Platform Upgrade",
            "projectOwner": "Helen Park",
            "projectStartDate": "2024-11-01",
            "projectTargetDate": "2025-04-30",
            "tasks": [
            {
                "id": 1,
                "name": "Analyze current system",
                "kanbanColumn": "Done",
                "urgent": true,
                "targetDate": "2024-11-15",
                "assignedTo": "Ian Foster",
                "completedDate": "2024-11-14"
            },
            {
                "id": 2,
                "name": "Design new architecture",
                "kanbanColumn": "In Progress",
                "urgent": true,
                "targetDate": "2024-12-01",
                "assignedTo": "Julia Chang",
                "completedDate": ""
            },
            {
                "id": 3,
                "name": "Develop inventory management module",
                "kanbanColumn": "To Do",
                "urgent": false,
                "targetDate": "2024-12-15",
                "assignedTo": "Kevin Wong",
                "completedDate": ""
            },
            {
                "id": 4,
                "name": "Implement payment gateway integration",
                "kanbanColumn": "To Do",
                "urgent": true,
                "targetDate": "2024-12-31",
                "assignedTo": "Linda Martinez",
                "completedDate": ""
            },
            {
                "id": 5,
                "name": "Develop customer support ticketing system",
                "kanbanColumn": "Backlog",
                "urgent": false,
                "targetDate": "2025-01-15",
                "assignedTo": "",
                "completedDate": ""
            },
            {
                "id": 6,
                "name": "Perform security audit",
                "kanbanColumn": "Backlog",
                "urgent": true,
                "targetDate": "2025-02-01",
                "assignedTo": "",
                "completedDate": ""
            }
            ],
            "kanban": {
            "columns": [
                {
                "name": "Backlog",
                "color": "lightpink"
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
                "name": "Review",
                "color": "lavender"
                },
                {
                "name": "Testing",
                "color": "peachpuff"
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
                "id": 1,
                "name": "Helen Park",
                "role": "Project Manager"
                },
                {
                "id": 2,
                "name": "Ian Foster",
                "role": "Systems Analyst",
                "activity": {
                    "completedTasks": 6,
                    "completeTasksInLast3Days": "1"
                }
                },
                {
                "id": 3,
                "name": "Julia Chang",
                "role": "Software Architect",
                "activity": {
                    "completedTasks": 4,
                    "completeTasksInLast3Days": "0"
                }
                },
                {
                "id": 4,
                "name": "Kevin Wong",
                "role": "Backend Developer",
                "activity": {
                    "completedTasks": 2,
                    "completeTasksInLast3Days": "1"
                }
                },
                {
                "id": 5,
                "name": "Linda Martinez",
                "role": "Frontend Developer",
                "activity": {
                    "completedTasks": 3,
                    "completeTasksInLast3Days": "0"
                }
                }
            ]
            },
            "messages": {
            "directMessages": [
                {
                "from": 2,
                "to": 3,
                "content": "System analysis report is ready for your review.",
                "timestamp": "2024-11-15T16:45:00Z",
                "markedRead": false
                },
                {
                "from": 3,
                "to": 1,
                "content": "Helen, can we schedule a meeting to discuss the new architecture?",
                "timestamp": "2024-11-16T09:30:00Z",
                "markedRead": true
                },
                {
                "from": 4,
                "to": 5,
                "content": "Linda, I'll need your input on the frontend requirements for the inventory module.",
                "timestamp": "2024-11-17T11:20:00Z",
                "markedRead": false
                },
                {
                "from": 1,
                "to": 2,
                "content": "Great job on the system analysis, Ian. Let's discuss the findings in our next team meeting.",
                "timestamp": "2024-11-18T14:00:00Z",
                "markedRead": true
                }
            ],
            "projectChatBoard": [
                {
                "author": 1,
                "summary": "Project Kickoff",
                "content": "Welcome to the E-commerce Platform Upgrade project! Let's work together to deliver an outstanding solution.",
                "timestamp": "2024-11-02T09:00:00Z",
                "acknowledged": true
                },
                {
                "author": 2,
                "summary": "Analysis Complete",
                "content": "The current system analysis is complete. I've shared the report for review.",
                "timestamp": "2024-11-15T17:00:00Z",
                "acknowledged": false
                },
                {
                "author": 3,
                "summary": "Architecture Planning",
                "content": "I'll be working on the new architecture design. Feel free to share any ideas or concerns.",
                "timestamp": "2024-11-17T10:30:00Z",
                "acknowledged": false
                }
            ]
            },
            "risks": [
            {
                "id": 1,
                "userFlag": 1,
                "riskLevel": "High",
                "riskFactors": {
                "timeline": 4,
                "budget": 3,
                "dependencies": 5,
                "resources": 4,
                "complexity": 4,
                "total": 20
                }
            },
            {
                "id": 2,
                "userFlag": 3,
                "riskLevel": "Medium",
                "riskFactors": {
                "timeline": 3,
                "budget": 2,
                "dependencies": 4,
                "resources": 3,
                "complexity": 4,
                "total": 16
                }
            }
            ]
        },
        {
            "projectId": 4,
            "projectName": "AI-Powered Customer Service Chatbot",
            "projectOwner": "Michael Chen",
            "projectStartDate": "2024-12-01",
            "projectTargetDate": "2025-06-30",
            "tasks": [
            {
                "id": 1,
                "name": "Define chatbot requirements",
                "kanbanColumn": "Done",
                "urgent": true,
                "targetDate": "2024-12-15",
                "assignedTo": "Olivia Wilson",
                "completedDate": "2024-12-14"
            },
            {
                "id": 2,
                "name": "Design conversation flows",
                "kanbanColumn": "In Progress",
                "urgent": true,
                "targetDate": "2025-01-15",
                "assignedTo": "Paul Thompson",
                "completedDate": ""
            },
            {
                "id": 3,
                "name": "Develop NLP model",
                "kanbanColumn": "To Do",
                "urgent": false,
                "targetDate": "2025-02-28",
                "assignedTo": "Rachel Kim",
                "completedDate": ""
            },
            {
                "id": 4,
                "name": "Integrate with existing customer database",
                "kanbanColumn": "To Do",
                "urgent": true,
                "targetDate": "2025-03-31",
                "assignedTo": "Samuel Lee",
                "completedDate": ""
            },
            {
                "id": 5,
                "name": "Implement multi-language support",
                "kanbanColumn": "Backlog",
                "urgent": false,
                "targetDate": "2025-05-15",
                "assignedTo": "",
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
                "name": "To Do",
                "color": "lightyellow"
                },
                {
                "name": "In Progress",
                "color": "lightblue"
                },
                {
                "name": "Testing",
                "color": "peachpuff"
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
                "id": 1,
                "name": "Michael Chen",
                "role": "Project Manager"
                },
                {
                "id": 2,
                "name": "Olivia Wilson",
                "role": "Business Analyst",
                "activity": {
                    "completedTasks": 5,
                    "completeTasksInLast3Days": "1"
                }
                },
                {
                "id": 3,
                "name": "Paul Thompson",
                "role": "UX Designer",
                "activity": {
                    "completedTasks": 3,
                    "completeTasksInLast3Days": "0"
                }
                },
                {
                "id": 4,
                "name": "Rachel Kim",
                "role": "AI Engineer",
                "activity": {
                    "completedTasks": 2,
                    "completeTasksInLast3Days": "1"
                }
                },
                {
                "id": 5,
                "name": "Samuel Lee",
                "role": "Backend Developer",
                "activity": {
                    "completedTasks": 4,
                    "completeTasksInLast3Days": "0"
                }
                }
            ]
            },
            "messages": {
            "directMessages": [
                {
                "from": 2,
                "to": 1,
                "content": "Michael, the chatbot requirements document is ready for your review.",
                "timestamp": "2024-12-14T16:30:00Z",
                "markedRead": true
                },
                {
                "from": 1,
                "to": 3,
                "content": "Paul, how's the progress on the conversation flows?",
                "timestamp": "2024-12-20T11:15:00Z",
                "markedRead": false
                },
                {
                "from": 4,
                "to": 5,
                "content": "Samuel, can we discuss the integration points for the customer database next week?",
                "timestamp": "2024-12-22T14:45:00Z",
                "markedRead": false
                }
            ],
            "projectChatBoard": [
                {
                "author": 1,
                "summary": "Project Kickoff",
                "content": "Welcome to the AI-Powered Customer Service Chatbot project! Let's revolutionize our customer support.",
                "timestamp": "2024-12-02T10:00:00Z",
                "acknowledged": true
                },
                {
                "author": 2,
                "summary": "Requirements Finalized",
                "content": "The chatbot requirements have been finalized and shared with the team.",
                "timestamp": "2024-12-15T09:30:00Z",
                "acknowledged": false
                },
                {
                "author": 4,
                "summary": "AI Model Research",
                "content": "I've compiled a list of potential NLP models for our chatbot. We'll discuss in our next meeting.",
                "timestamp": "2024-12-18T15:20:00Z",
                "acknowledged": false
                }
            ]
            },
            "risks": [
            {
                "id": 1,
                "userFlag": 4,
                "riskLevel": "High",
                "riskFactors": {
                "timeline": 3,
                "budget": 2,
                "dependencies": 4,
                "resources": 3,
                "complexity": 5,
                "total": 17
                }
            }
            ]
        },
        
        ]
}