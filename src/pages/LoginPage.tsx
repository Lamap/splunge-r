import './LoginPage.scss';
import React, { ChangeEvent, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { requestLogin, requestLogout } from '../services/services';
import useLocalStorageState from 'use-local-storage-state';
import { IUserBase } from 'splunge-common-lib/lib/interfaces/IUserBase';
import { NavigateFunction } from 'react-router/dist/lib/hooks';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../enums/AppRoute';
import { IUserLoginResponse } from 'splunge-common-lib';
import { useTranslation } from 'react-i18next';

export const LoginPage: React.FC = (): React.ReactElement => {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [user, setUser] = useLocalStorageState<IUserBase | undefined>('user');
    const navigate: NavigateFunction = useNavigate();
    const { t } = useTranslation('common');

    function logIn(): void {
        console.log(email, password);
        if (!email || !password) {
            return;
        }
        requestLogin(email, password).then((result: IUserLoginResponse): void => setUser(result));
    }
    function onEmailChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setEmail(event.target.value);
    }
    function onPasswordChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setPassword(event.target.value);
    }
    async function logOut(): Promise<void> {
        await requestLogout();
        setUser(undefined);
    }
    function goToDashboard(): void {
        navigate(AppRoute.DASHBOARD);
    }
    return (
        <div className="spg-login-page">
            <div className="spg-login-page__content">
                {!user && (
                    <>
                        <div className="spg-login-page__input-field">
                            <TextField size="small" label={t('loginPage.emailLabel')} className="spg-login-page__input" onChange={onEmailChange} />
                        </div>
                        <div className="spg-login-page__input-field">
                            <TextField
                                size="small"
                                label={t('loginPage.passwordLabel')}
                                type="password"
                                className="spg-login-page__input"
                                onChange={onPasswordChange}
                            />
                        </div>
                        <div className="spg-login-page__action">
                            <Button onClick={logIn} variant={'contained'}>
                                {t('loginPage.loginLabel')}
                            </Button>
                        </div>
                    </>
                )}
                {!!user && (
                    <div>
                        <div
                            className="spg-login-page__user-logged-in-info"
                            dangerouslySetInnerHTML={{ __html: t('loginPage.status', { user: user.email }) }}
                        ></div>
                        <div className="spg-login-page__logout-actions">
                            <span className="spg-login-page__go-to-dashboard">
                                <Button onClick={logOut} variant={'outlined'}>
                                    {t('loginPage.logoutLabel')}
                                </Button>
                            </span>

                            <Button onClick={goToDashboard} variant={'contained'}>
                                {t('loginPage.gotoDashboardLabel')}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
