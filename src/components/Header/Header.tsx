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

    function onLogoClicked(): void {
        navigate('/');
    }

    return (
        <div className="spg-header">
            <button className="spg-header__logo" onClick={onLogoClicked}>
                Splunge
            </button>
            <AccountCircleIcon className="spg-header__menu" onClick={onLoginClicked} />
        </div>
    );
};
