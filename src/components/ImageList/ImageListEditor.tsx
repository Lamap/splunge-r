import './ImageListEditor.scss';
import { ISpgImageWithStates } from '../../interfaces/ISpgImage';
import React, { useEffect, useState } from 'react';
import { ISpgPointWithStates } from '../../interfaces/ISpgPoint';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface IProps {
    readonly images: ISpgImageWithStates[];
    readonly highlightedImages?: string[];
    readonly points: ISpgPointWithStates[];
    readonly className?: string;
    readonly onNewImageAdded?: (file: string) => void;
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
    const [sortedImages, setSortedImages] = useState<ISpgImageWithStates[]>([]);
    useEffect(() => {
        setSortedImages(images.sort((a, b) => (a.isHighlighted ? -1 : 1)));
    }, [images]);
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
        !!onNewImageAdded &&
            onNewImageAdded(
                'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Tab%C3%A1n_a_bont%C3%A1s_el%C5%91tt.jpg/280px-Tab%C3%A1n_a_bont%C3%A1s_el%C5%91tt.jpg',
            );
    }
    function getImageClassnames(image: ISpgImageWithStates): string[] {
        return ['spg-image-list__image', ...(image.isHighlighted ? ['spg-image-list__image--highlighted'] : [''])];
    }
    return (
        <div className={classNames.join(' ')}>
            <div className="spg-image-list__header">
                <Button onClick={addNewImage} variant={'outlined'} size={'small'} endIcon={<AddIcon />}>
                    Add new image
                </Button>
            </div>
            {sortedImages.map((image: ISpgImageWithStates) => (
                <div key={image.id} className={getImageClassnames(image).join(' ')}>
                    {getIsConnected(image.id) && <div>Connected to a point</div>}
                    {!getIsConnected(image.id) && <div>No connection to any point</div>}
                    <img className="spg-image-list__img" src={image.url} alt={image.url} />
                    <div className="spg-image-list__image-actions">
                        {!!getIsConnected(image.id) && (
                            <span className="spg-image-list__image-action-btn">
                                <Button size={'small'} variant={'contained'} onClick={(): void => changePointConnection(image.id)}>
                                    Reconnect to point
                                </Button>
                            </span>
                        )}
                        {!!getIsConnected(image.id) && (
                            <span className="spg-image-list__image-action-btn">
                                <Button size={'small'} variant={'contained'} onClick={(): void => detachPointFromImage(image.id)}>
                                    detach point from image
                                </Button>
                            </span>
                        )}
                        {!!getIsConnected(image.id) && (
                            <span className="spg-image-list__image-action-btn">
                                <Button size={'small'} variant={'contained'} onClick={(): void => highlightPointOfImage(image.id)}>
                                    Show connected points
                                </Button>
                            </span>
                        )}
                        {!getIsConnected(image.id) && (
                            <span className="spg-image-list__image-action-btn">
                                <Button size={'small'} variant={'contained'} onClick={(): void => onConnectToImageClicked(image.id)}>
                                    Connect to point
                                </Button>
                            </span>
                        )}
                        <span className="spg-image-list__image-action-btn">
                            <Button size={'small'} variant={'contained'}>
                                Edit
                            </Button>
                        </span>
                        <span className="spg-image-list__image-action-btn">
                            <Button size={'small'} variant={'contained'} color={'error'}>
                                Delete
                            </Button>
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};
