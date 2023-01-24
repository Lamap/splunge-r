import './SpgFileUploader.scss';
import React, { ChangeEvent, useState } from 'react';
import { Alert, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
interface IProps {
    readonly maxFileSize: number;
    readonly className?: string;
    readonly accept?: string;
    readonly onFileUploaded?: (file: File, widthPerHeightRatio: number) => void;
}
export const SpgFileUploader: React.FC<IProps> = ({
    maxFileSize = 500 * 1024,
    className,
    onFileUploaded,
    accept = 'image/*',
}: IProps): React.ReactElement => {
    const classNamesArray: string[] = ['spg-file-uploader', ...(!!className ? [className] : [])];
    const [warning, setWarning] = useState<string>('');

    function fileUploaded(event: ChangeEvent<HTMLInputElement>): void {
        if (!event.target.files) {
            return;
        }
        const file: File = event.target.files[0];
        if (file.size > maxFileSize) {
            return setWarning('This file is bigger then then the maximum allowed 500 kb file size.');
        }
        const reader: FileReader = new FileReader();
        reader.onloadend = (event: ProgressEvent<FileReader>): void => {
            if (event.target) {
                const img: HTMLImageElement = new Image();
                img.onload = (): void => {
                    !!onFileUploaded && onFileUploaded(file, img.width / img.height);
                };
                img.onerror = (): void => {
                    setWarning('Problem with file uploading');
                };
                img.src = event.target.result as string;
            }
        };
        reader.readAsDataURL(file);
        console.log(file.size);

        setWarning('');
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
