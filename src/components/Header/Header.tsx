import './Header.scss';
import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const SpgHeader: React.FC = (): React.ReactElement => {
    return (
        <div className="spg-header">
            <span className="spg-header__logo">Splunge</span>
            <AccountCircleIcon className="spg-header__menu" />
        </div>
    );
};
