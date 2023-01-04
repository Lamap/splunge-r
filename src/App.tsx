import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Page1 } from './pages/Page1';
import { DashboardPage } from './pages/DashboardPage';

function App(): React.ReactElement {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Page1 />} />
                <Route path="/dashboard/:id" element={<DashboardPage />} />
            </Routes>
        </Router>
    );
}

export default App;
