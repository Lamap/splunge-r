import './DashboardImageList.scss';
import { ISpgImageWithStates } from '../../interfaces/ISpgImageWithStates';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { ISpgPointWithStates } from '../../interfaces/ISpgPointWithStates';
import { DashboardImage } from '../DashboardImage/DashboardImage';
import { ISpgImage } from 'splunge-common-lib';
import { SpgFileUploader } from '../FileUploader/SpgFileUploader';

interface IProps {
    readonly images: ISpgImageWithStates[];
    readonly points: ISpgPointWithStates[];
    readonly className?: string;
    readonly onNewImageAdded?: (file: File, widthPerHeightRatio: number) => void;
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
}: IProps): React.ReactElement => {
    const classNames: string[] = ['spg-dashboard-image-list', ...(!!className ? [className] : [])];
    const [imagesOfSelectedPoint, setImagesOfSelectedPoint] = useState<ISpgImageWithStates[]>([]);
    const [restOfImages, setRestOfImages] = useState<ISpgImageWithStates[]>([]);
    const listRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    useEffect(() => {
        setImagesOfSelectedPoint(images.filter((image: ISpgImageWithStates) => image.isHighlighted));
        setRestOfImages(images.filter((image: ISpgImageWithStates) => !image.isHighlighted));
        if (listRef.current) {
            listRef.current.scrollTop = 0;
        }
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
        return !!points.find((point: ISpgPointWithStates) => point.images?.includes(imageId));
    }

    function addNewImage(file: File, widthPerHeightRatio: number): void {
        !!onNewImageAdded && onNewImageAdded(file, widthPerHeightRatio);
    }
    return (
        <div className={classNames.join(' ')} ref={listRef}>
            <div className="spg-dashboard-image-list__header">
                <SpgFileUploader maxFileSize={500 * 1024} onFileUploaded={addNewImage} />
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
