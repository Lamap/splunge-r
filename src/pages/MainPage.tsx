import './MainPage.scss';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { SpgMap } from '../components/Map/SpgMap';
import { ISpgPointWithStates } from '../interfaces/ISpgPointWithStates';
import { requestImagesFetch, requestPointsFetch } from '../services/servicesMock';
import { IPointFetchResponse, ISpgPoint } from 'splunge-common-lib';
import { SpgImageList } from '../components/ImageList/SpgImageList';
import { ISpgImageWithStates } from '../interfaces/ISpgImageWithStates';
import { useNavigate } from 'react-router-dom';
import { NavigateFunction } from 'react-router/dist/lib/hooks';
import { LatLngLiteral, Map, Point } from 'leaflet';
import { PointImageConnection } from '../components/PointImageConnection/PointImageConnection';
import { IXYPoint } from '../interfaces/IXYPoint';

export function MainPage(): React.ReactElement {
    const [points, setPoints] = useState<ISpgPointWithStates[]>([]);
    //const [highlightedPointId, setHighlightedPointId] = useState<string>();
    // const [selectedPointId, setSelectedPointId] = useState<string>();
    const [images, setImages] = useState<ISpgImageWithStates[]>([]);
    const [panTo, setPanTo] = useState<LatLngLiteral>();
    const [mapRef, setMapRef] = useState<Map>();
    const [arrowStartXY, setArrowStartXY] = useState<IXYPoint | null>();
    const [arrowEndXY, setArrowEndXY] = useState<IXYPoint | null>();
    const imageListRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
    const mapContainerRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
    const navigate: NavigateFunction = useNavigate();

    useEffect((): void => {
        requestPointsFetch(true)
            .then((pointsResult: IPointFetchResponse) => {
                setPoints(pointsResult.filter(point => !!point.images.length));
            })
            .catch((err: Error) => {
                console.error(err);
            });
        requestImagesFetch()
            .then(imagesResult => setImages(imagesResult))
            .catch((err: Error) => {
                console.error(err);
            });
    }, []);

    function launchImage(imageId: string): void {
        console.log('launch', imageId);
        navigate(`/picture/${imageId}`);
    }
    function targetPointOfImage(imageId: string, x: number, y: number): void {
        const pointOfImage: ISpgPoint | undefined = points.find((point: ISpgPoint) => point.images.includes(imageId));
        if (!pointOfImage) {
            return;
        }
        //setHighlightedPointId(pointOfImage.id);
        setPoints(
            points.map((point: ISpgPoint) => {
                return {
                    ...point,
                    isHighlighted: point.id === pointOfImage.id,
                    isSelected: false,
                };
            }),
        );
        setImages(
            images.map(image => {
                return {
                    ...image,
                    isHighlighted: false,
                    isSelected: image.id === imageId,
                };
            }),
        );
        setPanTo(pointOfImage.position);
        if (!mapContainerRef.current || !imageListRef.current) {
            return;
        }
        console.log('mapContainerRef.current?.clientWidth, x', mapContainerRef.current?.clientWidth, x);
        setArrowStartXY(new Point(mapContainerRef.current?.clientWidth / 2, mapContainerRef.current?.clientHeight / 2 - 30));
        setArrowEndXY({ x: mapContainerRef.current?.clientWidth + x, y });
    }
    function highLightImagesOfPoint(pointId: string): void {
        const selectedPoint: ISpgPoint | undefined = points.find((point: ISpgPointWithStates) => pointId === point.id);
        if (!selectedPoint) {
            return;
        }
        setImages(
            images.map((image: ISpgImageWithStates) => {
                return {
                    ...image,
                    isSelected: false,
                    isHighlighted: selectedPoint.images.includes(image.id),
                };
            }),
        );
        setPoints(
            points.map((point: ISpgPoint) => {
                return {
                    ...point,
                    isHighlighted: false,
                    isSelected: point.id === pointId,
                };
            }),
        );
        if (!mapRef || !mapContainerRef?.current) {
            return;
        }
        const { x, y }: Point = mapRef.latLngToContainerPoint(selectedPoint?.position);
        setArrowStartXY({ x, y });
        setArrowEndXY({ x: mapContainerRef.current?.clientWidth, y: 75 });
    }
    return (
        <div className="spg-main-page">
            <div ref={mapContainerRef} className="spg-main-page__map-container">
                <SpgMap
                    className="spg-main-page__map"
                    isInteractionDisabled={true}
                    isEditing={false}
                    isPointAddingMode={false}
                    points={points}
                    panTo={panTo}
                    onMapRefInitialised={(map: Map): void => setMapRef(map)}
                    onPointClicked={highLightImagesOfPoint}
                    markersCountShowOnlyOnHover={true}
                    onMoveStart={(): void => {
                        setArrowEndXY(null);
                        setArrowStartXY(null);
                    }}
                />
            </div>

            <div ref={imageListRef}>
                <SpgImageList
                    className="spg-main-page__images"
                    images={images}
                    onLaunchImage={launchImage}
                    points={points}
                    onTargetPointOfImage={targetPointOfImage}
                />
            </div>

            {!!arrowStartXY && (
                <div
                    style={{
                        position: 'absolute',
                        width: '10px',
                        height: '10px',
                        background: '#ff0000',
                        borderRadius: '100%',
                        left: `${arrowStartXY.x}px`,
                        top: `${arrowStartXY.y}px`,
                        zIndex: '9999999',
                    }}
                ></div>
            )}
            {!!arrowEndXY && (
                <div
                    style={{
                        position: 'absolute',
                        width: '10px',
                        height: '10px',
                        background: '#ff0000',
                        borderRadius: '100%',
                        left: `${arrowEndXY.x}px`,
                        top: `${arrowEndXY.y}px`,
                        zIndex: '9999999',
                    }}
                ></div>
            )}
            {!!arrowStartXY && !!arrowEndXY && <PointImageConnection start={arrowStartXY} end={arrowEndXY} />}
        </div>
    );
}
