import './Error404.scss';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const Error404: React.FC = (): React.ReactElement => {
    const { t } = useTranslation('common');

    return (
        <div className={'spg-404-page'}>
            <div className={'spg-404-page__header'}>404</div>
            <div className={'spg-404-page__text'} dangerouslySetInnerHTML={{ __html: t('page404.body', { url: window.location.href }) || '' }}></div>
        </div>
    );
};
