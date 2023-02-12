import React from 'react';
import { Alert, Snackbar } from '@mui/material';
interface IProps {
    readonly isOpen: boolean;
    readonly onClose: () => void;
}
export const ServerSleepNotification: React.FC<IProps> = ({ isOpen, onClose }: IProps): React.ReactElement => {
    return (
        <Snackbar open={isOpen} onClose={onClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} sx={{ width: '100%' }}>
            <Alert onClose={onClose} severity="warning">
                Slow response time. Most probably the server was sleeping and this is the first ping for a while so it is just waking up right now.
                Please wait for few more seconds or even 1 minute, or try refreshing the page.
            </Alert>
        </Snackbar>
    );
};
