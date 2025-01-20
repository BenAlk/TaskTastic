breakdown of tasktastic plan.

App.js - control router/routes/route
Auth/Login - controls logging in.
Auth/Signup - controls signing up.
Layout > will have 3 elements to it. Header Navbar(left side) and Outlet to control the content.
Header > will have main logo and user avartar which will lead to settings. will also have a project switcher. this wil be a component that lets you start a new project, or select from a list of active projects.(when set as active project from this list - it will be active for the whole app, until another is selected or a new one is created) edit button for the active project too.
Outlet > will render the page based on the navbars selection.

NavBar > will have a logo at the top, user details, and then a list of links to the different segments of the app. at the bottom will be an area for error guidance... ie to highlight if something is missing when creating a new project, but not limited to that.

Navlist - Home(dashboard), team, messages,tasks, kanban, eisenhower, achievements.

Dashoard > contains 4 sections.
1. activity - Team member activity such as overdue tasks, task due soon, tasks completed recently - compose graph.
2. messages - 2 sections - unread messages, and important board messages.
3. tasks - quick bar chart showing how many tasks in each kanban column.
4. timeline - 2 sections - chart showing how far into the project we are, and how close the to the target date. and risk cards highlighting any tasks that are at risk of causing problems.


CreatePage > will have 3 segments.
1. Project Info > information such as name, project owner, setup date. start date, target date, secondary admins allowed, eisenhower enabled for project.
2. Project Team > select from previously collaborated users, or add new ones. Once added they can be highlighted and admin can be toggled, or they can be deleted.
3. Kanban Setup > add new kanban columns, re-arrange them, delete them.

Edit Project Page > will have the same information as the create page, but will be editable by the project owner and some elements by the admins.

Team Page > will have a list of users, their roles, much more information than on the create page.

Messages page > 2 segments.
1. Direct Messages > list of messages for you, and ability to send new ones.
2. Board messages > list of messages for the team, and ability to send new ones.

Tasks page > 2 segments.
1. New Tasks - add new tasks to the project.
2. Edit Tasks - edit tasks that are already in the project.

Kanban page > 1 segments.
1. Kanban Board - list of columns, and cards for each task.
clicking on a card would open a modal with information on the task, and the ability to progress it in the kanban board, or flag for risk.

Eisenhower page > simple eisenhower matrix showing tasks by urgency and importance.

Achievements page > list of achievements, when tasks are done they go into here.


src/
├── components/
│   ├── layout/
│   │   ├── Header/
│   │   │   ├── Header.js
│   │   │   ├── ProjectSwitcher.js
│   │   │   └── UserAvatar.js
│   │   ├── Navbar/
│   │   │   ├── Navbar.js
│   │   │   ├── NavList.js
│   │   │   └── ErrorGuidance.js
│   │   └── Layout.js
│   ├── auth/
│   │   ├── Login.js
│   │   └── Signup.js
│   ├── dashboard/
│   │   ├── ActivitySection.js
│   │   ├── MessageSection.js
│   │   ├── TaskSection.js
│   │   └── TimelineSection.js
│   ├── project/
│   │   ├── ProjectInfo.js
│   │   ├── ProjectTeam.js
│   │   └── KanbanSetup.js
│   ├── team/
│   │   └── TeamList.js
│   ├── messages/
│   │   ├── DirectMessages.js
│   │   └── BoardMessages.js
│   ├── tasks/
│   │   ├── NewTask.js
│   │   └── EditTask.js
│   ├── kanban/
│   │   ├── KanbanBoard.js
│   │   └── TaskCard.js
│   ├── eisenhower/
│   │   └── EisenhowerMatrix.js
│   ├── achievements/
│   │   └── AchievementList.js
│   └── common/
│       ├── Modal.js
│       ├── Chart.js
│       └── Card.js
├── pages/
│   ├── DashboardPage.js
│   ├── CreateProjectPage.js
│   ├── EditProjectPage.js
│   ├── TeamPage.js
│   ├── MessagesPage.js
│   ├── TasksPage.js
│   ├── KanbanPage.js
│   ├── EisenhowerPage.js
│   └── AchievementsPage.js
├── routes/
│   └── Routes.js
├── context/
│   ├── AuthContext.js
│   └── ProjectContext.js
├── hooks/
│   ├── useProject.js
│   └── useAuth.js
├── services/
│   ├── api.js
│   ├── projectService.js
│   └── userService.js
├── utils/
│   ├── dateUtils.js
│   └── projectUtils.js
├── styles/
│   ├── global.css
│   └── variables.css
└── App.js
