import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ProjectProvider } from "../context/ProjectContext"
import PropTypes from 'prop-types';

// Layout components
import Layout from '../components/layout/Layout';

// Page components
import DashboardPage from '../pages/DashboardPage';
import CreateProjectPage from '../pages/CreateProjectPage';
import EditProjectPage from '../pages/EditProjectPage';
import TeamPage from '../pages/TeamPage';
import MessagesPage from '../pages/MessagesPage';
import TasksPage from '../pages/TasksPage';
import KanbanPage from '../pages/KanbanPage';
import EisenhowerPage from '../pages/EisenhowerPage';
import AchievementsPage from '../pages/AchievementsPage';
import SettingsPage from '../pages/SettingsPage';

// Auth components
import Login from '../components/auth/Login';
import Signup from '../components/auth/Signup';

//Welcome components
import Welcome from '../components/welcome/Welcome';

const PrivateRoute = ({ children }) => {
    const { currentUser } = useAuth();
    return currentUser ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

const ProtectedRoutes = () => (
    <ProjectProvider>
        <PrivateRoute>
            <Layout>
                <Outlet />
            </Layout>
        </PrivateRoute>
    </ProjectProvider>
);

const AppRoutes = () => {
    const { currentUser } = useAuth();
    return (

            <Routes>
                <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <Welcome />} />
                <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <Login />} />
                <Route path="/signup" element={currentUser ? <Navigate to="/dashboard" /> : <Signup />} />

                {/* Protected routes */}
                    <Route element={<ProtectedRoutes />}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/create-project" element={<CreateProjectPage />} />
                        <Route path="/edit-project/:projectId" element={<EditProjectPage />} />
                        <Route path="/team" element={<TeamPage />} />
                        <Route path="/messages" element={<MessagesPage />} />
                        <Route path="/tasks" element={<TasksPage />} />
                        <Route path="/kanban" element={<KanbanPage />} />
                        <Route path="/eisenhower" element={<EisenhowerPage />} />
                        <Route path="/achievements" element={<AchievementsPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                    </Route>
            </Routes>
);
}

export default AppRoutes
