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
import { LoginPage } from './pages/LoginPage';
import useLocalStorageState from 'use-local-storage-state';
import { IUserBase } from 'splunge-common-lib/lib/interfaces/IUserBase';

function App(): React.ReactElement {
    const [user] = useLocalStorageState<IUserBase | undefined>('user');

    console.log('user', user);
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
                    <Route path="/dashboard/:id" element={!!user ? <DashboardPage /> : <div>403</div>} />
                    <Route path="/picture/:id" element={<ImagePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/403" element={<div>403</div>} />
                    <Route path="/*" element={<div>404</div>} />
                </Routes>
            </QueryParamProvider>
        </Router>
    );
}

export default App;
