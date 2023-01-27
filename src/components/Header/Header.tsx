import './Header.scss';
import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { NavigateFunction } from 'react-router/dist/lib/hooks';
import { useNavigate } from 'react-router-dom';

export const SpgHeader: React.FC = (): React.ReactElement => {
    const navigate: NavigateFunction = useNavigate();

    function onLoginClicked(): void {
        navigate('/login');
    }

    return (
        <div className="spg-header">
            <span className="spg-header__logo">Splunge</span>
            <AccountCircleIcon className="spg-header__menu" onClick={onLoginClicked} />
        </div>
    );
};
