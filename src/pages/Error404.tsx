import './Error404.scss';
import React from 'react';

export const Error404: React.FC = (): React.ReactElement => {
    return (
        <div className={'spg-404-page'}>
            <div className={'spg-404-page__header'}>404</div>
            <div className={'spg-404-page__text'}>
                This url does not exist: <b>{window.location.href}</b>.
            </div>
        </div>
    );
};
