import '../../node_modules/leaflet/dist/leaflet.css';
import './DashboardPage.scss';
import React, { ChangeEvent, SyntheticEvent, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SpgMap } from '../components/Map/SpgMap';
import ISpgPoint, { ISpgPointClient } from '../interfaces/ISpgPoint';
import { LatLngLiteral } from 'leaflet';
import { FormControlLabel, Slider, Switch } from '@mui/material';
import { ISpgImage } from '../interfaces/ISpgImage';
import { ImageListEditor } from '../components/ImageList/ImageListEditor';
import { addImageToPointCall, createPointForImageCall, deletePointCall, detachImageFromPointCall, updatePointCall } from '../services/servicesMock';

export function DashboardPage(): React.ReactElement {
    const { id } = useParams();
    const [selectedPointId, setSelectedPointId] = useState<string>();
    const [selectedImageId, setSelectedImageId] = useState<string>();
    const [panTo, setPanTo] = useState<LatLngLiteral>();
    const [points, setPoints] = useState<ISpgPointClient[]>([
        {
            position: { lat: 47.888, lng: 19.03 },
            id: '2134455',
            images: [],
        },
    ]);
    const [images, setImages] = useState<ISpgImage[]>([
        { id: 'sdfsdfdssdasdfs', url: 'sdfsdfs23wqeddfsdfsdf' },
        { id: 'sdfsdfdsfs', url: 'sdfsdfsdfsdfsdf' },
    ]);
    function createPointForImage(position: LatLngLiteral): void {
        if (!!selectedImageId) {
            const extendedPoints: ISpgPointClient[] = createPointForImageCall(position, selectedImageId, points);
            setPoints(extendedPoints);
        }
        setSelectedImageId(undefined);
    }

    function pointClicked(id: string): void {
        // if the selectedImageId is not set we set the point state to selected
        if (!selectedImageId) {
            setSelectedPointId(id);
            const adjustedPoints: ISpgPointClient[] = points.map((point: ISpgPointClient): ISpgPointClient => {
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
    function quitPointSelection(): void {
        setSelectedPointId(undefined);
        const adjustedPoints: ISpgPointClient[] = points.map((point: ISpgPointClient): ISpgPointClient => {
            return {
                ...point,
                isSelected: false,
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
    function onHasDirectionChanged(event: ChangeEvent<HTMLInputElement>): void {
        const selectedPoint: ISpgPoint | undefined = getSelectedPoint(selectedPointId);
        if (!selectedPoint) {
            return;
        }
        updatePoint({ ...selectedPoint, hasDirection: event.target.checked });
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
                const updatedPoints: ISpgPointClient[] = points.map((point: ISpgPointClient) => {
                    if (point.id === modifiedPoint.id) {
                        return { ...updatedPoint, isSelected: modifiedPoint.id === selectedPointId };
                    }
                    return point;
                });
                setPoints(updatedPoints);
            })
            .catch(err => console.error(err));
    }
    function getSelectedPoint(selectedId: string | undefined): ISpgPointClient | undefined {
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
        quitPointSelection();
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
        const updatedPoints: ISpgPointClient[] = addImageToPointCall(pointId, selectedImageId, points);
        setPoints(updatedPoints);
        setSelectedImageId(undefined);
        console.log('quitting');
    }
    function showPointOfImage(imageId: string): void {
        const attachedPoint: ISpgPointClient | undefined = points.find(point => point.images.includes(imageId));
        if (attachedPoint) {
            const adjustedPoints: ISpgPointClient[] = points.map((point: ISpgPointClient): ISpgPointClient => {
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

    function addNewImage(): void {
        console.log('add new image');
        setImages([...images, { id: new Date().getTime().toString(), url: 'asdasda' }]);
    }
    return (
        <div className="spg-dashboard">
            page2 {id}
            {!!selectedPointId && (
                <div className={'spg-dashboard__edit-point'}>
                    {selectedPointId}
                    {getSelectedPoint(selectedPointId)?.hasDirection && (
                        <Slider
                            min={0}
                            max={360}
                            size="small"
                            onChangeCommitted={onDirectionChanged}
                            defaultValue={getSelectedPoint(selectedPointId)?.direction}
                        />
                    )}
                    {`---${getSelectedPoint(selectedPointId)?.hasDirection}`}
                    <FormControlLabel
                        label={'Has direction'}
                        control={
                            <Switch
                                onChange={onHasDirectionChanged}
                                name={'hasdirection'}
                                defaultChecked={getSelectedPoint(selectedPointId)?.hasDirection}
                            />
                        }
                    />
                    <button onClick={deletePoint}>Delete point</button>
                    <button onClick={quitPointSelection}>Exit selection</button>
                </div>
            )}
            {`imageConnectionId: ${selectedImageId}`}
            {!!selectedImageId && (
                <div>
                    click to a point to connect the image or click to the map to add a new one <button onClick={quitImageConnection}>cancel</button>
                </div>
            )}
            <div className="spg-dashboard__map-and-images">
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

                <ImageListEditor
                    images={images}
                    className="spg-dashboard__image-list"
                    onConnectImageToPoint={startConnectImageToPointProcess}
                    onChangePointOfImage={startConnectImageToPointProcess}
                    onDetachImageFromPoint={detachImageFromPoint}
                    onShowLinkedPointOfImage={showPointOfImage}
                    onNewImageAdded={addNewImage}
                    points={points}
                />
            </div>
        </div>
    );
}
