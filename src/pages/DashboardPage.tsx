import '../../node_modules/leaflet/dist/leaflet.css';
import './DashboardPage.scss';
import React, { SyntheticEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SpgMap } from '../components/Map/SpgMap';
import ISpgPoint, { ISpgPointWithStates } from '../interfaces/ISpgPoint';
import { LatLngLiteral } from 'leaflet';
import { Button, Checkbox, FormControlLabel, Slider } from '@mui/material';
import { ISpgImage, ISpgImageWithStates } from '../interfaces/ISpgImage';
import { ImageListEditor } from '../components/ImageList/ImageListEditor';
import {
    addImageToPointCall,
    createNewImageCall,
    createPointForImageCall,
    deletePointCall,
    detachImageFromPointCall,
    updatePointCall,
} from '../services/servicesMock';

export function DashboardPage(): React.ReactElement {
    const { id } = useParams();
    const [selectedPointId, setSelectedPointId] = useState<string>();
    const [selectedImageId, setSelectedImageId] = useState<string>();
    const [panTo, setPanTo] = useState<LatLngLiteral>();
    const [points, setPoints] = useState<ISpgPointWithStates[]>([
        {
            position: { lat: 47.888, lng: 19.03 },
            id: '2134455',
            images: [],
        },
    ]);
    const [images, setImages] = useState<ISpgImageWithStates[]>([
        {
            id: 'sdfsdfdssdasdfs',
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Tab%C3%A1n_a_bont%C3%A1s_el%C5%91tt.jpg/280px-Tab%C3%A1n_a_bont%C3%A1s_el%C5%91tt.jpg',
        },
        {
            id: 'sdfsdfdsfs',
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Tab%C3%A1n_a_bont%C3%A1s_el%C5%91tt.jpg/280px-Tab%C3%A1n_a_bont%C3%A1s_el%C5%91tt.jpg',
        },
    ]);
    console.log(id);
    function createPointForImage(position: LatLngLiteral): void {
        clearPointHighlighting();
        if (!!selectedImageId) {
            const extendedPoints: ISpgPointWithStates[] = createPointForImageCall(position, selectedImageId, points);
            setPoints(extendedPoints);
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
    function onPointPositionChanged(id: string, newPosition: LatLngLiteral): void {
        console.log('m', id, newPosition);
        const pointToUpdate: ISpgPoint | undefined = points.find(point => point.id === id);
        if (!pointToUpdate) {
            return;
        }
        updatePoint({ ...pointToUpdate, position: newPosition });
    }
    function updatePoint(modifiedPoint: ISpgPoint): void {
        updatePointCall(modifiedPoint)
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
        deletePointCall(selectedPointId, points, images)
            .then((pointsAfterDeletion: ISpgPoint[]) => {
                setPoints(pointsAfterDeletion);
            })
            .catch(err => console.error(err));
    }
    function detachImageFromPoint(selectedImageId: string): void {
        console.log('detach', selectedImageId);
        detachImageFromPointCall(selectedImageId, points)
            .then(updatedPoints => {
                setPoints(updatedPoints);
            })
            .catch(err => console.error(err));
    }
    function startConnectImageToPointProcess(id: string): void {
        console.log(id);
        clearPointSelection();
        clearPointHighlighting();
        setSelectedImageId(id);
    }
    function quitImageConnection(): void {
        setSelectedImageId(undefined);
    }
    function addImageToPoint(pointId: string): void {
        console.log('addImage to point');
        if (!selectedImageId) {
            return;
        }
        const updatedPoints: ISpgPointWithStates[] = addImageToPointCall(pointId, selectedImageId, points);
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

    function addNewImage(file: string): void {
        console.log('add new image');
        createNewImageCall(file)
            .then((newImage: ISpgImage) => {
                setImages([...images, newImage]);
            })
            .catch(err => console.error(err));
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
                            <div className="spg-dashboard__editing-header">You have selected a point on the map</div>
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
                                    <Button variant={'outlined'} color={'error'} size={'small'} onClick={deletePoint}>
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
            <ImageListEditor
                images={images}
                className="spg-dashboard__image-list"
                onConnectImageToPoint={startConnectImageToPointProcess}
                onChangePointOfImage={startConnectImageToPointProcess}
                onDetachImageFromPoint={detachImageFromPoint}
                onShowLinkedPointOfImage={highlightPointOfImage}
                onNewImageAdded={addNewImage}
                points={points}
            />
        </div>
    );
}
