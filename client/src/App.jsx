import './App.css'
import {BrowserRouter as Router } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { ProjectProvider } from "./context/ProjectContext"
import { TaskProvider } from "./context/TaskContext"
import { UserProvider } from "./context/UserContext"
import AppRoutes from "./routes/Routes"

function App() {
    return (
        <Router>
            <AuthProvider>
                <UserProvider>
                    <ProjectProvider>
                        <TaskProvider>
                            <div className="App">
                                <AppRoutes />
                            </div>
                        </TaskProvider>
                    </ProjectProvider>
                </UserProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;
