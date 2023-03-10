import './DashboardImage.scss';
import React from 'react';
import { ISpgImageWithStates } from '../../interfaces/ISpgImageWithStates';
import { Button } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { ISpgImage } from 'splunge-common-lib';
import { useTranslation } from 'react-i18next';

interface IProps {
    readonly image: ISpgImageWithStates;
    readonly className?: string;
    readonly onConnectImageToPoint?: (imageId: string) => void;
    readonly onDetachImageFromPoint?: (imageId: string) => void;
    readonly onShowLinkedPointOfImage?: (imageId: string) => void;
    readonly onChangePointOfImage?: (imageId: string) => void;
    readonly onEditImage?: (image: ISpgImage) => void;
    readonly onDeleteImage?: (imageId: string) => void;
    readonly isConnected?: boolean;
}

export const DashboardImage: React.FC<IProps> = ({
    image,
    isConnected,
    className,
    onConnectImageToPoint,
    onChangePointOfImage,
    onDetachImageFromPoint,
    onShowLinkedPointOfImage,
    onDeleteImage,
    onEditImage,
}: IProps): React.ReactElement => {
    const baseClassname: string = 'spg-dashboard-image';
    const classNamesArray: string[] = [baseClassname, ...(!!className ? [className] : [])];
    const { t } = useTranslation('common');

    function changePointConnection(): void {
        !!onChangePointOfImage && onChangePointOfImage(image.id);
    }
    function detachPointFromImage(): void {
        !!onDetachImageFromPoint && onDetachImageFromPoint(image.id);
    }
    function highlightPointOfImage(): void {
        !!onShowLinkedPointOfImage && onShowLinkedPointOfImage(image.id);
    }
    function connectToImage(): void {
        !!onConnectImageToPoint && onConnectImageToPoint(image.id);
    }
    function deleteImage(): void {
        !!onDeleteImage && onDeleteImage(image.id);
    }
    function editImage(): void {
        !!onEditImage && onEditImage(image);
    }
    return (
        <div className={classNamesArray.join(' ')}>
            {!!isConnected && (
                <span className={`${baseClassname}__linkage`}>
                    <LinkIcon className={`${baseClassname}__linkage-icon`} color={'primary'} />
                </span>
            )}
            {!isConnected && (
                <span className={`${baseClassname}__linkage`}>
                    <LinkOffIcon className={`${baseClassname}__linkage-icon`} color={'primary'} />
                </span>
            )}
            <img className={`${baseClassname}__img`} src={image.url} alt={image.url} />
            <div className={`${baseClassname}__image-actions`}>
                {!!isConnected && (
                    <span className={`${baseClassname}__image-action-btn`}>
                        <Button size={'small'} variant={'contained'} onClick={changePointConnection}>
                            {t('dashboardImageList.reconnectToPoint')}
                        </Button>
                    </span>
                )}
                {!!isConnected && (
                    <span className={`${baseClassname}__image-action-btn`}>
                        <Button size={'small'} variant={'contained'} onClick={detachPointFromImage}>
                            {t('dashboardImageList.detachPointFromImage')}
                        </Button>
                    </span>
                )}
                {!!isConnected && (
                    <span className={`${baseClassname}__image-action-btn`}>
                        <Button size={'small'} variant={'contained'} onClick={highlightPointOfImage}>
                            {t('dashboardImageList.showConnectedPoints')}
                        </Button>
                    </span>
                )}
                {!isConnected && (
                    <span className={`${baseClassname}__image-action-btn`}>
                        <Button size={'small'} variant={'contained'} onClick={connectToImage}>
                            {t('dashboardImageList.connectToPoint')}
                        </Button>
                    </span>
                )}
                <span className={`${baseClassname}__image-action-btn`}>
                    <Button size={'small'} variant={'contained'} onClick={editImage}>
                        {t('general.edit')}
                    </Button>
                </span>
                <span className={`${baseClassname}__image-action-btn`}>
                    <Button size={'small'} variant={'contained'} color={'error'} onClick={deleteImage}>
                        {t('general.delete')}
                    </Button>
                </span>
            </div>
        </div>
    );
};
