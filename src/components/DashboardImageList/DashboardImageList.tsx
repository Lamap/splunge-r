import './DashboardImageList.scss';
import { ISpgImage, ISpgImageWithStates } from '../../interfaces/ISpgImage';
import React, { useEffect, useState } from 'react';
import { ISpgPointWithStates } from '../../interfaces/ISpgPoint';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DashboardImage } from '../DashboardImage/DashboardImage';

interface IProps {
    readonly images: ISpgImageWithStates[];
    readonly points: ISpgPointWithStates[];
    readonly className?: string;
    readonly onNewImageAdded?: (file: string) => void;
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

    function addNewImage(): void {
        !!onNewImageAdded &&
            onNewImageAdded(
                'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Tab%C3%A1n_a_bont%C3%A1s_el%C5%91tt.jpg/280px-Tab%C3%A1n_a_bont%C3%A1s_el%C5%91tt.jpg',
            );
    }
    return (
        <div className={classNames.join(' ')}>
            <div className="spg-dashboard-image-list__header">
                <Button onClick={addNewImage} variant={'outlined'} size={'small'} endIcon={<AddIcon />}>
                    Add new image
                </Button>
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
