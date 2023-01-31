import React from 'react';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { NavigateFunction } from 'react-router/dist/lib/hooks';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../enums/AppRoute';

export const AxiosSettings: React.FC = (): React.ReactElement => {
    const navigate: NavigateFunction = useNavigate();

    axios.defaults.withCredentials = true;
    axios.interceptors.response.use(
        (value: AxiosResponse) => {
            return value;
        },
        (error: AxiosError) => {
            if (error.response?.status === 403) {
                navigate(AppRoute.ERROR_403);
                localStorage.removeItem('user');
            }
        },
    );
    return <></>;
};
