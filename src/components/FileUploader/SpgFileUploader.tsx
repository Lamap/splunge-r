import './SpgFileUploader.scss';
import React, { ChangeEvent, useState } from 'react';
import { Alert, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
interface IProps {
    readonly maxFileSize: number;
    readonly className?: string;
    readonly accept?: string;
    readonly onFileUploaded?: (file: File) => void;
}
export const SpgFileUploader: React.FC<IProps> = ({
    maxFileSize = 500 * 1024,
    className,
    onFileUploaded,
    accept = 'image/*',
}): React.ReactElement => {
    const classNamesArray: string[] = ['spg-file-uploader', ...(!!className ? [className] : [])];
    const [warning, setWarning] = useState<string>('');

    function fileUploaded(event: ChangeEvent<HTMLInputElement>): void {
        if (!event.target.files) {
            return;
        }
        const file: File = event.target.files[0];
        console.log(file.size);

        if (file.size > maxFileSize) {
            return setWarning('This file is bigger then then the maximum allowed 500 kb file size.');
        }
        setWarning('');
        !!onFileUploaded && onFileUploaded(file);
    }
    return (
        <div className={classNamesArray.join(' ')}>
            <input id="file-upload" type="file" onChange={fileUploaded} accept={accept} hidden />
            <label htmlFor="file-upload">
                <Button variant={'outlined'} size={'small'} endIcon={<AddIcon />} component="span">
                    Add new image
                </Button>
            </label>
            {!!warning && (
                <Alert severity="warning" onClose={(): void => setWarning('')} className="spg-file-uploader__warning">
                    {warning}
                </Alert>
            )}
        </div>
    );
};
