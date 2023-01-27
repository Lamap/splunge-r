import './LoginPage.scss';
import React, { ChangeEvent, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { requestLogin } from '../services/servicesMock';

export const LoginPage: React.FC = (): React.ReactElement => {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();

    function logIn(): void {
        console.log(email, password);
        if (!email || !password) {
            return;
        }
        requestLogin(email, password);
    }
    function onEmailChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setEmail(event.target.value);
    }
    function onPasswordChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {
        setPassword(event.target.value);
    }
    return (
        <div className="spg-login-page">
            <div className="spg-login-page__content">
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
            </div>
        </div>
    );
};
