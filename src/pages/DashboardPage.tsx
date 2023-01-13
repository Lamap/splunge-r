import '../../node_modules/leaflet/dist/leaflet.css';
import './DashboardPage.scss';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SpgMap } from '../components/Map/SpgMap';
import { ISpgPointWithStates } from '../interfaces/ISpgPointWithStates';
import { LatLngLiteral } from 'leaflet';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Slider, TextField } from '@mui/material';
import { ISpgImageWithStates } from '../interfaces/ISpgImageWithStates';
import { DashboardImageList } from '../components/DashboardImageList/DashboardImageList';
import { IImageDeleteResponse, IPointDeleteResponse, ISpgImage, ISpgPoint } from 'splunge-common-lib';

import {
    requestAttachImageToPoint,
    requestCreateNewImage,
    requestCreatePointForImage,
    requestDeleteImage,
    requestDeletePoint,
    detachImageFromPointCall,
    requestUpdatePoint,
    requestPointsFetch,
    requestImagesFetch,
    requestUpdateImage,
} from '../services/servicesMock';

interface IDashboardWarning {
    readonly title: string;
    readonly text?: string;
    readonly acknowledgeLabel: string;
}
interface IDashboardConfirmation {
    readonly title: string;
    readonly text?: string;
    readonly applyLabel: string;
    readonly cancelLabel: string;
    readonly applyFunction: () => void;
}
export function DashboardPage(): React.ReactElement {
    const { id } = useParams();
    const [selectedPointId, setSelectedPointId] = useState<string>();
    const [selectedImageId, setSelectedImageId] = useState<string>();
    const [panTo, setPanTo] = useState<LatLngLiteral>();
    const [warning, setWarning] = useState<IDashboardWarning | null>(null);
    const [confirmation, setConfirmation] = useState<IDashboardConfirmation | null>(null);
    const [editedImage, setEditedImage] = useState<ISpgImage | null>();
    const [points, setPoints] = useState<ISpgPointWithStates[]>([]);
    const [images, setImages] = useState<ISpgImageWithStates[]>([]);
    console.log(id);
    useEffect((): void => {
        requestPointsFetch()
            .then(allPoints => setPoints(allPoints))
            .catch(err => console.error(err));
        requestImagesFetch()
            .then(fetchedImages => setImages(fetchedImages))
            .catch(err => console.error(err));
    }, []);
    async function createPointForImage(position: LatLngLiteral): Promise<void> {
        clearPointHighlighting();
        if (!!selectedImageId) {
            try {
                const updatedPointExtendedByTheNew: ISpgPoint[] = await requestCreatePointForImage(position, selectedImageId);
                setPoints(updatedPointExtendedByTheNew);
            } catch (err) {
                console.error(err);
            }
        }
        setSelectedImageId(undefined);
    }

    function pointClicked(id: string): void {
        // if the selectedImageId is not set we set the point state to selected
        if (!selectedImageId) {
            setSelectedPointId(id);
            const selectedPoint: ISpgPointWithStates | undefined = getSelectedPoint(id);
            setImages(
                images.map(image => {
                    return {
                        ...image,
                        isHighlighted: selectedPoint?.images.includes(image.id),
                    };
                }),
            );
            const adjustedPoints: ISpgPointWithStates[] = points.map((point: ISpgPointWithStates): ISpgPointWithStates => {
                return {
                    ...point,
                    isSelected: point.id === id,
                    isHighlighted: false,
                };
            });
            setPoints(adjustedPoints);

            return;
        }
        // if selectedImageId is set we add the image to the point
        if (getSelectedPoint(id)?.images.includes(selectedImageId)) {
            setWarning({
                acknowledgeLabel: 'I got it',
                title: 'This image has already linked to this point',
                text: 'You can not double-connect the image to the same point, choose another one or click on the map to create a new point.',
            });
            return console.warn('This point has been already connected to the selected image.');
        }
        return addImageToPoint(id);
    }
    function clearPointSelection(): void {
        setSelectedPointId(undefined);
        setImages(
            images.map(image => {
                return {
                    ...image,
                    isHighlighted: false,
                };
            }),
        );
        const adjustedPoints: ISpgPointWithStates[] = points.map((point: ISpgPointWithStates): ISpgPointWithStates => {
            return {
                ...point,
                isSelected: false,
            };
        });
        setPoints(adjustedPoints);
    }
    function clearPointHighlighting(): void {
        const adjustedPoints: ISpgPointWithStates[] = points.map((point: ISpgPointWithStates): ISpgPointWithStates => {
            return {
                ...point,
                isHighlighted: false,
            };
        });
        setPoints(adjustedPoints);
    }
    function onDirectionChanged(event: Event | SyntheticEvent<Element, Event>, value: number | number[]): void {
        const selectedPoint: ISpgPoint | undefined = getSelectedPoint(selectedPointId);
        if (!selectedPoint) {
            return;
        }
        updatePoint({ ...selectedPoint, direction: value as number });
    }
    function onHasDirectionChanged(event: React.SyntheticEvent, checked: boolean): void {
        const selectedPoint: ISpgPoint | undefined = getSelectedPoint(selectedPointId);
        if (!selectedPoint) {
            return;
        }
        updatePoint({ ...selectedPoint, hasDirection: checked });
    }
    async function onPointPositionChanged(id: string, newPosition: LatLngLiteral): Promise<void> {
        console.log('m', id, newPosition);
        const pointToUpdate: ISpgPoint | undefined = points.find(point => point.id === id);
        if (!pointToUpdate) {
            return;
        }
        await updatePoint({ ...pointToUpdate, position: newPosition });
    }
    function updatePoint(modifiedPoint: ISpgPoint): void {
        requestUpdatePoint(modifiedPoint)
            .then((updatedPoint: ISpgPoint) => {
                const updatedPoints: ISpgPointWithStates[] = points.map((point: ISpgPointWithStates) => {
                    if (point.id === modifiedPoint.id) {
                        return { ...updatedPoint, isSelected: modifiedPoint.id === selectedPointId };
                    }
                    return point;
                });
                setPoints(updatedPoints);
            })
            .catch(err => console.error(err));
    }
    function getSelectedPoint(selectedId: string | undefined): ISpgPointWithStates | undefined {
        return points.find(({ id }) => id === selectedId);
    }
    function deletePoint(): void {
        console.log('delete', selectedPointId);

        if (!selectedPointId) {
            return;
        }

        setConfirmation({
            applyFunction: (): void => {
                requestDeletePoint(selectedPointId)
                    .then((result: IPointDeleteResponse) => {
                        console.log('D::::', result);
                        setPoints(points.filter(point => point.id !== result.deletedPointId));
                    })
                    .catch(err => console.error(err));
                closeConfirmation();
            },
            title: 'Are you sure you want to delete this point?',
            applyLabel: 'Yes, delete it',
            cancelLabel: 'Cancel',
        });
    }
    function detachImageFromPoint(selectedImageId: string): void {
        console.log('detach', selectedImageId);
        detachImageFromPointCall(selectedImageId)
            .then(updatedPoint => {
                const updatedPoints: ISpgPoint[] = points.map((point: ISpgPoint) => {
                    if (updatedPoint.id === point.id) {
                        return updatedPoint;
                    }
                    return point;
                });
                setPoints(updatedPoints);
            })
            .catch(err => console.error(err));
    }
    function startConnectImageToPointProcess(id: string): void {
        console.log('startConnectImageToPointProcess', id);
        clearPointHighlighting();
        setSelectedImageId(id);
        clearPointSelection();
    }
    function quitImageConnection(): void {
        setSelectedImageId(undefined);
        clearPointSelection();
    }
    function addImageToPoint(pointId: string): void {
        console.log('addImage to point');
        if (!selectedImageId) {
            return;
        }
        const updatedPoints: ISpgPointWithStates[] = requestAttachImageToPoint(pointId, selectedImageId, points);
        setPoints(updatedPoints);
        setSelectedImageId(undefined);
        console.log('quitting');
    }
    function highlightPointOfImage(imageId: string): void {
        const attachedPoint: ISpgPointWithStates | undefined = points.find(point => point.images.includes(imageId));
        if (attachedPoint) {
            const adjustedPoints: ISpgPointWithStates[] = points.map((point: ISpgPointWithStates): ISpgPointWithStates => {
                return {
                    ...point,
                    isHighlighted: point.id === attachedPoint.id,
                };
            });
            setPoints(adjustedPoints);
            setPanTo(attachedPoint.position);
        }
        console.log(attachedPoint);
    }

    function addNewImage(file: File): void {
        console.log('add new image', file);

        requestCreateNewImage(file)
            .then((newImage: ISpgImage) => {
                setImages([newImage, ...images]);
            })
            .catch(err => console.error(err));
    }

    function deleteImage(imageToDeleteId: string): void {
        setConfirmation({
            applyFunction: (): void => {
                requestDeleteImage(imageToDeleteId)
                    .then((result: IImageDeleteResponse) => {
                        setImages(images.filter(image => image.id !== imageToDeleteId));
                        const updatedPoints: ISpgPoint[] = points.map((point: ISpgPoint): ISpgPoint => {
                            const updatedPoint: ISpgPoint | undefined = result.updatedPoints.find(({ id }) => point.id === id);
                            return updatedPoint || point;
                        });
                        setPoints(updatedPoints);
                    })
                    .catch(err => console.error(err));
                setConfirmation(null);
            },
            cancelLabel: 'Cancel',
            applyLabel: 'Yes, delete image',
            title: 'Are you sure you want to delete this image?',
        });
    }
    function closeWarningDialog(): void {
        setWarning(null);
    }
    function closeConfirmation(): void {
        setConfirmation(null);
    }
    function closeEditImage(): void {
        setEditedImage(null);
    }
    function editImage(image: ISpgImage): void {
        setEditedImage(image);
    }
    function saveEditedImage(): void {
        console.log(editedImage);
        if (!editedImage) {
            return;
        }
        try {
            requestUpdateImage(editedImage).then((result: ISpgImage): void => {
                setImages(
                    images.map(image => {
                        if (image.id === result?.id) {
                            return result;
                        }
                        return image;
                    }),
                );
            });
        } catch (err) {
            console.error(err);
        }

        setEditedImage(null);
    }

    function updateEditedImage(target: string, value: string): void {
        if (!editedImage) {
            return;
        }
        console.log(target, value);
        setEditedImage({
            ...editedImage,
            [target]: value,
        });
    }

    return (
        <div className="spg-dashboard">
            <div className="spg-dashboard__map-and-actions">
                <div className={'spg-dashboard__actions'}>
                    {!selectedPointId && !selectedImageId && (
                        <div>
                            <div className="spg-dashboard__editing-header">
                                You can click on the point to edit and see the linked images either select an image to connect to a point
                            </div>
                            <ul>
                                <li>You can select on an image on the right and add or reconnect to a point, either create a new point for it.</li>
                                <li>
                                    You can select a point by clicking then you can see its direction and will see the connected images on the right.
                                </li>
                                <li>You can delete the selected point that does not have images linked.</li>
                            </ul>
                        </div>
                    )}
                    {!!selectedPointId && (
                        <>
                            <div className="spg-dashboard__editing-header">
                                {`You have selected a point on the map that has ${getSelectedPoint(selectedPointId)?.images.length} linked image(s)`}
                            </div>
                            <div>
                                Now you see the linked images highlighted on the right and can set the direction or remove it if no images are
                                attached
                            </div>
                            <div className="spg-dashboard__direction-group">
                                <FormControlLabel
                                    label={'Has direction'}
                                    onChange={onHasDirectionChanged}
                                    control={<Checkbox name={'hasdirection'} checked={!!getSelectedPoint(selectedPointId)?.hasDirection} />}
                                />
                                {getSelectedPoint(selectedPointId)?.hasDirection && (
                                    <div className="spg-dashboard__direction-slider">
                                        <Slider
                                            min={0}
                                            max={360}
                                            size="small"
                                            onChangeCommitted={onDirectionChanged}
                                            defaultValue={getSelectedPoint(selectedPointId)?.direction}
                                        />
                                    </div>
                                )}
                                <span className="spg-dashboard__delete-point-btn">
                                    <Button
                                        variant={'outlined'}
                                        color={'error'}
                                        size={'small'}
                                        onClick={deletePoint}
                                        disabled={!!getSelectedPoint(selectedPointId)?.images.length}
                                    >
                                        Delete point
                                    </Button>
                                </span>

                                <Button variant={'outlined'} size={'small'} onClick={clearPointSelection}>
                                    Release selection
                                </Button>
                            </div>
                        </>
                    )}
                    {!!selectedImageId && (
                        <div>
                            <div className="spg-dashboard__editing-header">You have selected an image.</div>
                            Now you can connect the image to a point by clicking on the marker or click on the map to create a new point and link to
                            the selected image.
                            <div className="spg-dashboard__point-connect-actions">
                                <Button variant={'outlined'} size={'small'} onClick={quitImageConnection}>
                                    Quit point connection process
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                <SpgMap
                    className="spg-dashboard__map"
                    isEditing={true}
                    isPointAddingMode={!!selectedImageId}
                    panTo={panTo}
                    points={points}
                    onMapClicked={createPointForImage}
                    onPointClicked={pointClicked}
                    onPointMoved={onPointPositionChanged}
                />
            </div>
            <DashboardImageList
                images={images}
                className="spg-dashboard__image-list"
                onConnectImageToPoint={startConnectImageToPointProcess}
                onChangePointOfImage={startConnectImageToPointProcess}
                onDeleteImage={deleteImage}
                onDetachImageFromPoint={detachImageFromPoint}
                onEditImage={editImage}
                onShowLinkedPointOfImage={highlightPointOfImage}
                onNewImageAdded={addNewImage}
                points={points}
            />
            <Dialog open={!!warning} onClose={closeWarningDialog}>
                <DialogTitle>{warning?.title}</DialogTitle>
                <DialogContent>{warning?.text}</DialogContent>
                <DialogActions>
                    <Button onClick={closeWarningDialog}>{warning?.acknowledgeLabel}</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={!!confirmation} onClose={closeConfirmation}>
                <DialogTitle>{confirmation?.title}</DialogTitle>
                <DialogContent>{confirmation?.text}</DialogContent>
                <DialogActions>
                    <Button onClick={confirmation?.applyFunction} color={'warning'}>
                        {confirmation?.applyLabel}
                    </Button>
                    <Button onClick={closeConfirmation}>{confirmation?.cancelLabel}</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={!!editedImage} onClose={closeEditImage}>
                <DialogTitle>Edit the selected image</DialogTitle>
                <DialogContent>
                    <img src={editedImage?.url} alt={editedImage?.url} />
                    <div>
                        <FormControlLabel
                            label={'Title'}
                            labelPlacement={'bottom'}
                            control={
                                <TextField
                                    size={'small'}
                                    variant={'standard'}
                                    onChange={(event: React.ChangeEvent<HTMLInputElement>): void => updateEditedImage('title', event.target.value)}
                                    defaultValue={editedImage?.title}
                                />
                            }
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={saveEditedImage}>Save</Button>
                    <Button onClick={closeEditImage}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
