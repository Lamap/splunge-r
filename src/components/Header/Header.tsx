import './Header.scss';
import React from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { NavigateFunction } from 'react-router/dist/lib/hooks';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const SpgHeader: React.FC = (): React.ReactElement => {
    const navigate: NavigateFunction = useNavigate();
    const { t, i18n } = useTranslation('common');

    function onLoginClicked(): void {
        navigate('/login');
    }

    function onLogoClicked(): void {
        navigate('/');
    }

    function toggleLanguage(): void {
        const newLanguage: string = i18n.language === 'en' ? 'hu' : 'en';
        i18n.changeLanguage(newLanguage);
    }

    return (
        <div className="spg-header">
            <button className="spg-header__logo" onClick={onLogoClicked}>
                {t('header.logo')}
            </button>
            <AccountCircleIcon className="spg-header__menu" onClick={onLoginClicked} />
            <button className="spg-header__language-toggle" onClick={toggleLanguage}>
                {i18n.language === 'en' ? 'hun' : 'eng'}
            </button>
        </div>
    );
};
