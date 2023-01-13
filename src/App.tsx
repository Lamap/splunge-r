import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { DashboardPage } from './pages/DashboardPage';

function App(): React.ReactElement {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/dashboard/:id" element={<DashboardPage />} />
            </Routes>
        </Router>
    );
}

export default App;
