import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MainPage } from './pages/MainPage';
import { DashboardPage } from './pages/DashboardPage';
import { ImagePage } from './pages/ImagePage';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import queryString from 'query-string';
import { SpgHeader } from './components/Header/Header';

function App(): React.ReactElement {
    return (
        <Router>
            <SpgHeader />
            <QueryParamProvider
                adapter={ReactRouter6Adapter}
                options={{
                    searchStringToObject: queryString.parse,
                    objectToSearchString: queryString.stringify,
                }}
            >
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/dashboard/:id" element={<DashboardPage />} />
                    <Route path="/picture/:id" element={<ImagePage />} />
                </Routes>
            </QueryParamProvider>
        </Router>
    );
}

export default App;
