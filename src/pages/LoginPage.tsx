import './LoginPage.scss';
import React, { ChangeEvent, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { requestLogin, requestLogout } from '../services/servicesMock';
import useLocalStorageState from 'use-local-storage-state';
import { IUserBase } from 'splunge-common-lib/lib/interfaces/IUserBase';
import { NavigateFunction } from 'react-router/dist/lib/hooks';
import { useNavigate } from 'react-router-dom';

export const LoginPage: React.FC = (): React.ReactElement => {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [user, setUser] = useLocalStorageState<IUserBase | undefined>('user');
    const navigate: NavigateFunction = useNavigate();

    function logIn(): void {
        console.log(email, password);
        if (!email || !password) {
            return;
        }
        requestLogin(email, password).then(result => setUser(result));
    }
    function onEmailChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setEmail(event.target.value);
    }
    function onPasswordChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setPassword(event.target.value);
    }
    function logOut(): void {
        setUser(undefined);
        document.cookie = 'jwt-token=;expires=' + new Date(0).toUTCString();
        requestLogout();
    }
    function goToDashboard(): void {
        navigate('/dashboard/yolo');
    }
    return (
        <div className="spg-login-page">
            <div className="spg-login-page__content">
                {!user && (
                    <>
                        <div className="spg-login-page__input-field">
                            <TextField size="small" label="Email" className="spg-login-page__input" onChange={onEmailChange} />
                        </div>
                        <div className="spg-login-page__input-field">
                            <TextField size="small" label="Password" type="password" className="spg-login-page__input" onChange={onPasswordChange} />
                        </div>
                        <div className="spg-login-page__action">
                            <Button onClick={logIn} variant={'contained'}>
                                Login
                            </Button>
                        </div>
                    </>
                )}
                {!!user && (
                    <div>
                        <div className="spg-login-page__user-logged-in-info">
                            You are logged in as <b>{user.email} </b>
                        </div>
                        <div className="spg-login-page__logout-actions">
                            <span className="spg-login-page__go-to-dashboard">
                                <Button onClick={logOut} variant={'outlined'}>
                                    Log out
                                </Button>
                            </span>

                            <Button onClick={goToDashboard} variant={'contained'}>
                                Go to dashboard
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
