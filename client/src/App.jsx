import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout/index'
import Dashboard from './features/Dashboard/index'
import CreateProject from './features/CreateProject/index';
function App() {
    return (
        <div className="App">
        <Router>
            <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="/NewProject" element={<CreateProject />} />
                </Route>
            </Routes>
        </Router>
        </div>
    );
}

export default App;
