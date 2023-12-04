import React from 'react';
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
import { AxiosSettings } from './utils/AxiosSettings';
import { AppRoute } from './enums/AppRoute';
import { Error404 } from './pages/Error404';
import { Error403 } from './pages/Error403';
import { useLivelinessHook } from './utils/livelinessHook';

function App(): React.ReactElement {
    const [user] = useLocalStorageState<IUserBase | undefined>('user');
    useLivelinessHook();

    return (
        <Router>
            <AxiosSettings />
            <SpgHeader />
            <QueryParamProvider
                adapter={ReactRouter6Adapter}
                options={{
                    searchStringToObject: queryString.parse,
                    objectToSearchString: queryString.stringify,
                }}
            >
                <Routes>
                    <Route path={AppRoute.MAIN} element={<MainPage />} />
                    <Route path={AppRoute.DASHBOARD} element={!!user ? <DashboardPage /> : <Error403 />} />
                    <Route path={AppRoute.IMAGE_END_POINT} element={<ImagePage />} />
                    <Route path={AppRoute.LOGIN_LOGOUT} element={<LoginPage />} />
                    <Route path={AppRoute.ERROR_403} element={<Error403 />} />
                    <Route path="/*" element={<Error404 />} />
                </Routes>
            </QueryParamProvider>
        </Router>
    );
}

export default App;
