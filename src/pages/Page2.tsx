import '../../node_modules/leaflet/dist/leaflet.css';
import React from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, ImageOverlay } from 'react-leaflet';
import mapSample from '../assets/maps/b1_22clr.gif';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { SpgMarker } from '../components/SpgMarker/SpgMarker';
import L, { DivIcon, MarkerCluster, Point } from 'leaflet';
export function Page2(): React.ReactElement {
    const { id } = useParams();
    /*
    const markers: { lat: number; lng: number }[] = [
        { lat: 47.25, lng: 19.25 },
        { lat: 47.23, lng: 19.21 },
        { lat: 47.27, lng: 19.27 },
        { lat: 47.22, lng: 19.22 },
        { lat: 47.21, lng: 19.29 },
        { lat: 47.21, lng: 19.21 },
        { lat: 47.28, lng: 19.2 },
    ];

     */

    function createClusterIcon(cluster: MarkerCluster): DivIcon {
        return new DivIcon({
            className: 'spg-marker-cluster-icon',
            html: `<span class="spg-marker-cluster-icon__circle">${cluster.getChildCount()}</span>`,
            iconSize: new Point(30, 30, true),
        });
    }
    return (
        <div>
            page2 {id}
            <MapContainer center={{ lat: 47.2, lng: 19.1 }} style={{ background: '#ff0000', height: '500px', width: '700px' }} zoom={12}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <MarkerClusterGroup maxClusterRadius={20} showCoverageOnHover={false} iconCreateFunction={createClusterIcon}>
                    <SpgMarker position={{ lat: 47, lng: 19.1 }} onClick={(): void => console.log('aaa')} />
                    <SpgMarker position={{ lat: 47.2, lng: 19.08 }} onClick={(): void => console.log('ccc')} />
                    <SpgMarker position={{ lat: 47.3, lng: 19.2 }} onClick={(): void => console.log('ooo')} />
                    <SpgMarker
                        position={{ lat: 47.2, lng: 18.2 }}
                        isDraggable={true}
                        onClick={(): void => console.log('bb')}
                        onDragEnd={(newPosition: L.LatLngExpression): void => console.log(newPosition)}
                    />
                    <SpgMarker position={{ lat: 47, lng: 19.0 }} onClick={(): void => console.log('dd')} direction={45} isHighLighted={true} />
                </MarkerClusterGroup>

                <ImageOverlay
                    zIndex={0}
                    bounds={[
                        [47, 19],
                        [47.5, 19.5],
                    ]}
                    url={mapSample}
                />
            </MapContainer>
        </div>
    );
}
