import './App.css'
import {BrowserRouter as Router } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
// import { ProjectProvider } from "./context/ProjectContext"
import AppRoutes from "./routes/Routes"

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="App">
                    <AppRoutes />
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
