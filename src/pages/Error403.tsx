import './Error403.scss';
import React from 'react';
import { Link } from '@mui/material';
import { NavigateFunction } from 'react-router/dist/lib/hooks';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../enums/AppRoute';
import { useTranslation } from 'react-i18next';

export const Error403: React.FC = (): React.ReactElement => {
    const navigate: NavigateFunction = useNavigate();
    const { t } = useTranslation('common');

    function goToLogin(): void {
        navigate(AppRoute.LOGIN_LOGOUT);
    }
    return (
        <div className={'spg-403-page'}>
            <div className={'spg-403-page__header'}>403</div>
            <div className={'spg-403-page__text'}>{t('page403.title')}</div>
            <div className={'spg-403-page__instruction'}>
                Maybe you just lost your session, please
                {t('page403.body1')}
                <Link href={''} onClick={goToLogin}>
                    {t('page403.bodyLink')}
                </Link>
                {t('page403.body2')}
            </div>
        </div>
    );
};
