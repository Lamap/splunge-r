import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Page1 } from './pages/Page1';
import { Page2 } from './pages/Page2';

function App(): React.ReactElement {
    return (
        <Router>
            <div className="App">something</div>
            <Routes>
                <Route path="/" element={<Page1 />} />
                <Route path="/bela/:id" element={<Page2 />} />
            </Routes>
        </Router>
    );
}

export default App;
