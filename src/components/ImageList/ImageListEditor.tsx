import './ImageListEditor.scss';
import { ISpgImage } from '../../interfaces/ISpgImage';
import React from 'react';
import { ISpgPointClient } from '../../interfaces/ISpgPoint';
import { Button } from '@mui/material';
interface IProps {
    readonly images: ISpgImage[];
    readonly highlightedImages?: string[];
    readonly points: ISpgPointClient[];
    readonly className?: string;
    readonly onNewImageAdded?: () => void;
    readonly onConnectImageToPoint?: (imageId: string) => void;
    readonly onDetachImageFromPoint?: (imageId: string) => void;
    readonly onShowLinkedPointOfImage?: (imageId: string) => void;
    readonly onChangePointOfImage?: (imageId: string) => void;
}
export const ImageListEditor: React.FC<IProps> = ({
    images,
    points,
    onNewImageAdded,
    onConnectImageToPoint,
    onChangePointOfImage,
    onDetachImageFromPoint,
    onShowLinkedPointOfImage,
    className,
    highlightedImages,
}): React.ReactElement => {
    const classNames: string[] = ['spg-image-list', ...(!!className ? [className] : [])];
    function onConnectToImageClicked(id: string): void {
        !!onConnectImageToPoint && onConnectImageToPoint(id);
    }
    function changePointConnection(id: string): void {
        console.log('changeConnection');
        !!onChangePointOfImage && onChangePointOfImage(id);
    }
    function getIsConnected(imageId: string): boolean {
        return !!points.find(point => point.images?.includes(imageId));
    }
    function detachPointFromImage(imageId: string): void {
        console.log('detach point');
        !!onDetachImageFromPoint && onDetachImageFromPoint(imageId);
    }
    function highlightPointOfImage(imageId: string): void {
        console.log('highlight', imageId);
        !!onShowLinkedPointOfImage && onShowLinkedPointOfImage(imageId);
    }
    function addNewImage(): void {
        !!onNewImageAdded && onNewImageAdded();
    }
    function isImageHighlighted(id: string): boolean {
        return !!highlightedImages?.includes(id);
    }
    function getImageClassnames(id: string): string[] {
        return ['spg-image-list__image', ...(isImageHighlighted(id) ? ['spg-image-list__image--highlighted'] : [''])];
    }
    return (
        <div className={classNames.join(' ')}>
            <div>
                <Button onClick={addNewImage}>Add new image</Button>
            </div>
            {images.map((image: ISpgImage) => (
                <div key={image.id} className={getImageClassnames(image.id).join(' ')}>
                    {getIsConnected(image.id) && <div>This image is connected to a point</div>}
                    {image.id}
                    {!!getIsConnected(image.id) && (
                        <button onClick={(): void => changePointConnection(image.id)}>connect image to another point or create a new point</button>
                    )}
                    {!!getIsConnected(image.id) && <button onClick={(): void => detachPointFromImage(image.id)}>detach point from image</button>}
                    {!!getIsConnected(image.id) && (
                        <button onClick={(): void => highlightPointOfImage(image.id)}>Show connected point of the image</button>
                    )}
                    {!getIsConnected(image.id) && (
                        <button onClick={(): void => onConnectToImageClicked(image.id)}>
                            Create a point for the image or add to an existing one
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};
