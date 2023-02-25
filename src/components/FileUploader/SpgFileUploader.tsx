import './SpgFileUploader.scss';
import React, { ChangeEvent, useState } from 'react';
import { Alert, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation('common');

    function fileUploaded(event: ChangeEvent<HTMLInputElement>): void {
        if (!event.target.files) {
            return;
        }
        const file: File = event.target.files[0];
        if (file.size > maxFileSize) {
            return setWarning(t('fileUploader.maxSizeWarning', { size: maxFileSize / 1024 }) || '');
        }
        const reader: FileReader = new FileReader();
        reader.onloadend = (event: ProgressEvent<FileReader>): void => {
            if (event.target) {
                const img: HTMLImageElement = new Image();
                img.onload = (): void => {
                    !!onFileUploaded && onFileUploaded(file, img.width / img.height);
                };
                img.onerror = (): void => {
                    setWarning(t('fileUploader.uploadGeneralError') || '');
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
                    {t('fileUploader.addNewImageLabel')}
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
