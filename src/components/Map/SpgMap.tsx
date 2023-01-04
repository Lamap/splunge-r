import './SpgMap.scss';
import '../../../node_modules/leaflet/dist/leaflet.css';
import React from 'react';
import { MapContainer, TileLayer, ImageOverlay } from 'react-leaflet';
import mapSample from '../../assets/maps/b1_22clr.gif';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { SpgMarker } from '../SpgMarker/SpgMarker';
import { LatLngLiteral, LeafletMouseEvent } from 'leaflet';
import { MapEventConnector } from './MapEventConnector';
import renderClusterIcon from './RenderClusterIcon';
import { ISpgPointWithStates } from '../../interfaces/ISpgPoint';

interface IProps {
    readonly isPointAddingMode?: boolean;
    readonly isEditing?: boolean;
    readonly className?: string;
    readonly center?: LatLngLiteral;
    readonly points: ISpgPointWithStates[];
    readonly onMapClicked?: (position: LatLngLiteral) => void;
    readonly onPointMoved?: (id: string, newPosition: LatLngLiteral) => void;
    readonly onPointClicked?: (id: string) => void;
    readonly panTo?: LatLngLiteral;
}

export const SpgMap: React.FC<IProps> = ({
    isPointAddingMode = false,
    isEditing = false,
    center = { lat: 47.49, lng: 19.035 },
    className,
    onMapClicked,
    onPointClicked,
    onPointMoved,
    points = [],
    panTo,
}): React.ReactElement => {
    function addNewPoint(event: LeafletMouseEvent): void {
        !!onMapClicked && onMapClicked(event.latlng);
    }
    const classNames: string[] = ['spg-map', ...(isPointAddingMode ? ['spg-map--point-adding-mode'] : []), ...(!!className ? [className] : [])];
    return (
        <div className={classNames.join(' ')}>
            <MapContainer center={center} zoom={15} className={'spg-map__container'}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapEventConnector onClick={addNewPoint} panTo={panTo} />
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
                            />
                        );
                    })}
                </MarkerClusterGroup>

                <ImageOverlay
                    zIndex={0}
                    bounds={[
                        [47.488865, 19.034961],
                        [47.495809, 19.04834],
                    ]}
                    url={mapSample}
                    opacity={0.7}
                />
            </MapContainer>
        </div>
    );
};
