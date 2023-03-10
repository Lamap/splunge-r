import './SpgMap.scss';
import '../../../node_modules/leaflet/dist/leaflet.css';
import React, { useState } from 'react';
import { MapContainer, TileLayer, ImageOverlay } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { SpgMarker } from '../SpgMarker/SpgMarker';
import { LatLngLiteral, LeafletMouseEvent, Map } from 'leaflet';
import { MapEventConnector } from './MapEventConnector';
import renderClusterIcon from './RenderClusterIcon';
import { ISpgPointWithStates } from '../../interfaces/ISpgPointWithStates';
import { MapOverlayController } from '../MapOverlayController/MapOverlayController';
import { mapOverlays as staticOverlays } from '../MockOverlays';
import IMapOverlay from '../../interfaces/IMapOverlay';
import { ISpgLatLngBounds } from 'splunge-common-lib/lib/interfaces/ISpgLatLngBounds';

interface IProps {
    readonly boundsLoaded?: (bounds: ISpgLatLngBounds) => void;
    readonly center?: LatLngLiteral;
    readonly className?: string;
    readonly hideOverlayControl?: boolean;
    readonly isInteractionDisabled?: boolean;
    readonly isPointAddingMode?: boolean;
    readonly isEditing?: boolean;
    readonly initialMapZoom?: number;
    readonly initialOverlays?: IMapOverlay[];
    readonly onMapRefInitialised?: (map: Map) => void;
    readonly onMapClicked?: (position: LatLngLiteral) => void;
    readonly onPointMoved?: (id: string, newPosition: LatLngLiteral) => void;
    readonly onPointClicked?: (id: string) => void;
    readonly panTo?: LatLngLiteral;
    readonly points: ISpgPointWithStates[];
    readonly markersCountShowOnlyOnHover?: boolean;
    readonly onMoveStart?: () => void;
    readonly onMove?: () => void;
    readonly onOverLaysChanged?: (overLays: IMapOverlay[]) => void;
}
export const SpgMap: React.FC<IProps> = ({
    boundsLoaded,
    isInteractionDisabled = false,
    isPointAddingMode = false,
    isEditing = false,
    center = { lat: 47.49, lng: 19.035 },
    className,
    hideOverlayControl = false,
    initialMapZoom = 15,
    initialOverlays = staticOverlays,
    onMapClicked,
    onPointClicked,
    onMapRefInitialised,
    onPointMoved,
    points = [],
    panTo,
    markersCountShowOnlyOnHover,
    onMoveStart,
    onMove,
    onOverLaysChanged,
}: IProps): React.ReactElement => {
    const classNames: string[] = [
        'spg-map',
        ...(isPointAddingMode ? ['spg-map--point-adding-mode'] : []),
        ...(hideOverlayControl ? ['spg-map--hide-overlay-control'] : []),
        ...(!!className ? [className] : []),
    ];
    const [overlays, setOverlays] = useState<IMapOverlay[]>(initialOverlays);
    const [mapZoom, setMapZoom] = useState<number>(initialMapZoom);
    function addNewPoint(event: LeafletMouseEvent): void {
        !!onMapClicked && onMapClicked(event.latlng);
    }
    function onOverlayOpacityChanged(id: string, value: number): void {
        const updatedOverlays: IMapOverlay[] = overlays.map((overlay: IMapOverlay): IMapOverlay => {
            if (overlay.id === id) {
                return {
                    ...overlay,
                    opacity: value,
                };
            }
            return overlay;
        });
        setOverlays(updatedOverlays);
        !!onOverLaysChanged && onOverLaysChanged(updatedOverlays);
    }
    function onMapZoomChanged(zoom: number): void {
        console.log(zoom);
        setMapZoom(zoom);
    }
    function overlayFilterFunction(overlay: IMapOverlay): boolean {
        return !!overlay.opacity && mapZoom > overlay.minDisplayZoom;
    }
    return (
        <div className={classNames.join(' ')}>
            <MapContainer
                center={center}
                zoom={initialMapZoom}
                className={'spg-map__container'}
                zoomControl={!isInteractionDisabled}
                dragging={!isInteractionDisabled}
                scrollWheelZoom={!isInteractionDisabled}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapEventConnector
                    onClick={addNewPoint}
                    panTo={panTo}
                    onZoomChanged={onMapZoomChanged}
                    boundsLoaded={(bounds: ISpgLatLngBounds): void => {
                        !!boundsLoaded && boundsLoaded(bounds);
                    }}
                    onMapInitialised={onMapRefInitialised}
                    onMoveStart={(): void => {
                        !!onMoveStart && onMoveStart();
                    }}
                    onMove={(): void => {
                        !!onMove && onMove();
                    }}
                />
                <MarkerClusterGroup maxClusterRadius={36} showCoverageOnHover={false} iconCreateFunction={renderClusterIcon}>
                    {points.map((point: ISpgPointWithStates): React.ReactElement => {
                        return (
                            <SpgMarker
                                direction={point.direction}
                                hasDirection={point.hasDirection}
                                key={point.id}
                                position={point.position}
                                isDraggable={isEditing}
                                isPointAddingMode={isPointAddingMode}
                                isHighlighted={point.isHighlighted}
                                isSelected={point.isSelected}
                                onClick={(): void => {
                                    !!onPointClicked && onPointClicked(point.id);
                                }}
                                onDragEnd={(newPosition: LatLngLiteral): void => {
                                    isEditing && !!onPointMoved && onPointMoved(point.id, newPosition);
                                }}
                                connectedImageCount={point.images.length}
                                showCountOnlyOnHover={markersCountShowOnlyOnHover}
                            />
                        );
                    })}
                </MarkerClusterGroup>

                {overlays.filter(overlayFilterFunction).map((overlay: IMapOverlay) => (
                    <ImageOverlay key={overlay.id} zIndex={0} bounds={overlay.bounds} url={overlay.url} opacity={overlay.opacity} />
                ))}
            </MapContainer>
            {!hideOverlayControl && (
                <MapOverlayController overlays={overlays} className="spg-map__map-overlay-controller" onOpacityChanged={onOverlayOpacityChanged} />
            )}
        </div>
    );
};
