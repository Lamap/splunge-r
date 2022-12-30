import './SpgMap.scss';
import '../../../node_modules/leaflet/dist/leaflet.css';
import React, { useState } from 'react';
import { MapContainer, TileLayer, ImageOverlay } from 'react-leaflet';
import mapSample from '../../assets/maps/b1_22clr.gif';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { SpgMarker } from '../SpgMarker/SpgMarker';
import { LatLngLiteral, LeafletMouseEvent } from 'leaflet';
import { MapEventConnector } from './MapEventConnector';
import renderClusterIcon from './RenderClusterIcon';

export function SpgMap(): React.ReactElement {
    const mockPositions: LatLngLiteral[] = [{ lat: 47.48, lng: 19.03 }];
    const [positions, setPositions] = useState<LatLngLiteral[]>(mockPositions);

    function addNewPoint(event: LeafletMouseEvent): void {
        setPositions([...positions, event.latlng]);
    }

    return (
        <div className="spg-map">
            <MapContainer center={{ lat: 47.49, lng: 19.035 }} zoom={15} className="spg-map__container">
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
                    {positions.map((pos: LatLngLiteral): React.ReactElement => {
                        return <SpgMarker key={`${pos.lat}-${pos.lng}`} position={pos} />;
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
}
