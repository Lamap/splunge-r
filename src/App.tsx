import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { DashboardPage } from './pages/DashboardPage';
import { ImagePage } from './pages/ImagePage';

function App(): React.ReactElement {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/dashboard/:id" element={<DashboardPage />} />
                <Route path="/picture/:id" element={<ImagePage />} />
            </Routes>
        </Router>
    );
}

export default App;
