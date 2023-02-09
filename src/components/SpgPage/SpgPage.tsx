import './SpgPage.scss';
import React from 'react';
import { CircularProgress } from '@mui/material';
import { AxiosError } from 'axios';
interface IProps {
    readonly children: React.ReactElement;
    readonly error?: AxiosError;
    readonly isLoading: boolean;
}
export const SpgPage: React.FC<IProps> = ({ children, error, isLoading }: IProps) => {
    const errorMessage: string = (error?.response?.data as string) || error?.response?.statusText || 'Unspecified error';
    const errorStatus: number | string = error?.response?.status || error?.response?.statusText || 'Unspecified error status';
    return (
        <div className={'spg-page'}>
            {isLoading && (
                <div className={'spg-page__loading-overlay'}>
                    <CircularProgress />
                </div>
            )}
            {!error && children}
            {!!error && (
                <div className={'spg-page__error'}>
                    <div className={'spg-page__error-code'}>{errorStatus}</div>
                    <div className={'spg-page__error-message'}>{errorMessage}</div>
                </div>
            )}
        </div>
    );
};
