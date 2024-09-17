import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout/index'
import Dashboard from './pages/Dashboard/index'
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="" element={<Dashboard />} />
            </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
