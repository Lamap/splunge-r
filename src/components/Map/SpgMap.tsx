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
import { ISpgPointClient } from '../../interfaces/ISpgPoint';

interface IProps {
    readonly isEditing?: boolean;
    readonly points: ISpgPointClient[];
    readonly onPointAddedToMap?: (position: LatLngLiteral) => void;
    readonly onPointMoved?: (id: string, newPosition: LatLngLiteral) => void;
    readonly onPointClicked?: (id: string) => void;
}

export const SpgMap: React.FC<IProps> = ({ isEditing = false, onPointAddedToMap, onPointClicked, onPointMoved, points = [] }): React.ReactElement => {
    console.log(isEditing);
    function addNewPoint(event: LeafletMouseEvent): void {
        !!onPointAddedToMap && onPointAddedToMap(event.latlng);
    }
    const classNames: string[] = ['spg-map__container', ...(isEditing ? ['spg-map__container--editing'] : [])];

    return (
        <div className="spg-map">
            <MapContainer center={{ lat: 47.49, lng: 19.035 }} zoom={15} className={classNames.join(' ')}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MapEventConnector onClick={addNewPoint} />
                <MarkerClusterGroup maxClusterRadius={36} showCoverageOnHover={false} iconCreateFunction={renderClusterIcon}>
                    <SpgMarker position={{ lat: 47.41, lng: 19.01 }} onClick={(): void => console.log('aaa')} />
                    <SpgMarker position={{ lat: 47.42, lng: 19.08 }} onClick={(): void => console.log('ccc')} />
                    <SpgMarker position={{ lat: 47.48, lng: 19.02 }} onClick={(): void => console.log('ooo')} />
                    <SpgMarker
                        position={{ lat: 47.42, lng: 18.2 }}
                        isDraggable={true}
                        onClick={(): void => console.log('bb')}
                        onDragEnd={(newPosition: LatLngLiteral): void => console.log(newPosition)}
                    />
                    <SpgMarker position={{ lat: 47, lng: 19.0 }} onClick={(): void => console.log('dd')} direction={45} isHighLighted={true} />
                    {points.map((point: ISpgPointClient): React.ReactElement => {
                        return (
                            <SpgMarker
                                key={point.id}
                                position={point.position}
                                isDraggable={isEditing}
                                isHighLighted={point.isSelected}
                                onClick={(): void => {
                                    !!onPointClicked && onPointClicked(point.id);
                                }}
                                onDragEnd={(newPosition: LatLngLiteral): void => {
                                    isEditing && !!onPointMoved && onPointMoved(point.id, newPosition);
                                }}
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
