import './Error403.scss';
import React from 'react';
import { Link } from '@mui/material';
import { NavigateFunction } from 'react-router/dist/lib/hooks';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../enums/AppRoute';

export const Error403: React.FC = (): React.ReactElement => {
    const navigate: NavigateFunction = useNavigate();

    function goToLogin(): void {
        navigate(AppRoute.LOGIN_LOGOUT);
    }
    return (
        <div className={'spg-403-page'}>
            <div className={'spg-403-page__header'}>403</div>
            <div className={'spg-403-page__text'}>You have no privilege to access this page either perform the action you tried.</div>
            <div className={'spg-403-page__instruction'}>
                Maybe you just lost your session, please{' '}
                <Link href={''} onClick={goToLogin}>
                    log in
                </Link>{' '}
                and try again.
            </div>
        </div>
    );
};
