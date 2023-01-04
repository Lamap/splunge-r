import './DashboardImage.scss';
import React from 'react';
import { ISpgImage, ISpgImageWithStates } from '../../interfaces/ISpgImage';
import { Button } from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import LinkOffIcon from '@mui/icons-material/LinkOff';

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
}): React.ReactElement => {
    const baseClassname: string = 'spg-dashboard-image';
    const classNamesArray: string[] = [baseClassname, ...(!!className ? [className] : [])];
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
                            Reconnect to point
                        </Button>
                    </span>
                )}
                {!!isConnected && (
                    <span className={`${baseClassname}__image-action-btn`}>
                        <Button size={'small'} variant={'contained'} onClick={detachPointFromImage}>
                            detach point from image
                        </Button>
                    </span>
                )}
                {!!isConnected && (
                    <span className={`${baseClassname}__image-action-btn`}>
                        <Button size={'small'} variant={'contained'} onClick={highlightPointOfImage}>
                            Show connected points
                        </Button>
                    </span>
                )}
                {!isConnected && (
                    <span className={`${baseClassname}__image-action-btn`}>
                        <Button size={'small'} variant={'contained'} onClick={connectToImage}>
                            Connect to point
                        </Button>
                    </span>
                )}
                <span className={`${baseClassname}__image-action-btn`}>
                    <Button size={'small'} variant={'contained'} onClick={editImage}>
                        Edit
                    </Button>
                </span>
                <span className={`${baseClassname}__image-action-btn`}>
                    <Button size={'small'} variant={'contained'} color={'error'} onClick={deleteImage}>
                        Delete
                    </Button>
                </span>
            </div>
        </div>
    );
};
