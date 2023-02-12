import React from 'react';
import { Alert, Snackbar } from '@mui/material';
import { AlertColor } from '@mui/material/Alert/Alert';
interface IProps {
    readonly message?: string;
    readonly onClose: () => void;
    readonly severity: AlertColor;
}
export const ToastMessage: React.FC<IProps> = ({ message, onClose, severity }: IProps): React.ReactElement => {
    return (
        <Snackbar open={!!message} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} sx={{ width: '100%' }}>
            <Alert onClose={onClose} severity={severity}>
                {message}
            </Alert>
        </Snackbar>
    );
};
