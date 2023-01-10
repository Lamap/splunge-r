import './DashboardImageList.scss';
import { ISpgImageWithStates } from '../../interfaces/ISpgImageWithStates';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { ISpgPointWithStates } from '../../interfaces/ISpgPointWithStates';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DashboardImage } from '../DashboardImage/DashboardImage';
import { ISpgImage } from 'splunge-common-lib';

interface IProps {
    readonly images: ISpgImageWithStates[];
    readonly points: ISpgPointWithStates[];
    readonly className?: string;
    readonly onNewImageAdded?: (file: File) => void;
    readonly onConnectImageToPoint?: (imageId: string) => void;
    readonly onDeleteImage?: (imageId: string) => void;
    readonly onDetachImageFromPoint?: (imageId: string) => void;
    readonly onEditImage?: (image: ISpgImage) => void;
    readonly onShowLinkedPointOfImage?: (imageId: string) => void;
    readonly onChangePointOfImage?: (imageId: string) => void;
}
export const DashboardImageList: React.FC<IProps> = ({
    images,
    points,
    onNewImageAdded,
    onConnectImageToPoint,
    onChangePointOfImage,
    onDetachImageFromPoint,
    onDeleteImage,
    onEditImage,
    onShowLinkedPointOfImage,
    className,
}): React.ReactElement => {
    const classNames: string[] = ['spg-dashboard-image-list', ...(!!className ? [className] : [])];
    const [imagesOfSelectedPoint, setImagesOfSelectedPoint] = useState<ISpgImageWithStates[]>([]);
    const [restOfImages, setRestOfImages] = useState<ISpgImageWithStates[]>([]);
    useEffect(() => {
        setImagesOfSelectedPoint(images.filter(image => image.isHighlighted));
        setRestOfImages(images.filter(image => !image.isHighlighted));
    }, [images]);

    function connectToPoint(id: string): void {
        !!onConnectImageToPoint && onConnectImageToPoint(id);
    }
    function changePointConnection(id: string): void {
        console.log('changeConnection');
        !!onChangePointOfImage && onChangePointOfImage(id);
    }

    function detachPointFromImage(imageId: string): void {
        console.log('detach point');
        !!onDetachImageFromPoint && onDetachImageFromPoint(imageId);
    }
    function highlightPointOfImage(imageId: string): void {
        console.log('highlight', imageId);
        !!onShowLinkedPointOfImage && onShowLinkedPointOfImage(imageId);
    }

    function deleteImage(id: string): void {
        console.log('delete image', id);
        !!onDeleteImage && onDeleteImage(id);
    }

    function editImage(image: ISpgImage): void {
        console.log('edit image', image);
        !!onEditImage && onEditImage(image);
    }

    function getIsConnected(imageId: string): boolean {
        return !!points.find(point => point.images?.includes(imageId));
    }

    function addNewImage(event: ChangeEvent<HTMLInputElement>): void {
        if (!event.target.files) {
            return;
        }
        !!onNewImageAdded && onNewImageAdded(event.target.files[0]);
    }
    return (
        <div className={classNames.join(' ')}>
            <div className="spg-dashboard-image-list__header">
                <input id="file-upload" type="file" onChange={addNewImage} accept="image/*" hidden />
                <label htmlFor="file-upload">
                    <Button variant={'outlined'} size={'small'} endIcon={<AddIcon />} component="span">
                        Add new image
                    </Button>
                </label>
            </div>

            {!!imagesOfSelectedPoint.length && (
                <div className="spg-dashboard-image-list__images-of-selected-point">
                    <div className="spg-dashboard-image-list__images-of-selected-point-header">{`The ${imagesOfSelectedPoint.length} image(s) connected to the selected point`}</div>
                    {imagesOfSelectedPoint.map((image: ISpgImageWithStates) => (
                        <DashboardImage
                            key={image.id}
                            image={image}
                            className="spg-dashboard-image-list__image-item"
                            isConnected={getIsConnected(image.id)}
                            onChangePointOfImage={changePointConnection}
                            onShowLinkedPointOfImage={highlightPointOfImage}
                            onDetachImageFromPoint={detachPointFromImage}
                            onConnectImageToPoint={connectToPoint}
                            onDeleteImage={deleteImage}
                            onEditImage={editImage}
                        />
                    ))}
                </div>
            )}
            <div className="spg-dashboard-image-list__rest-of-images">
                {!!imagesOfSelectedPoint.length && !!restOfImages.length && <div>Rest of the images</div>}
                {restOfImages.map((image: ISpgImageWithStates) => (
                    <DashboardImage
                        key={image.id}
                        image={image}
                        className="spg-dashboard-image-list__image-item"
                        isConnected={getIsConnected(image.id)}
                        onChangePointOfImage={changePointConnection}
                        onShowLinkedPointOfImage={highlightPointOfImage}
                        onDetachImageFromPoint={detachPointFromImage}
                        onConnectImageToPoint={connectToPoint}
                        onDeleteImage={deleteImage}
                        onEditImage={editImage}
                    />
                ))}
            </div>
        </div>
    );
};
