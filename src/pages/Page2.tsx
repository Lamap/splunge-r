import '../../node_modules/leaflet/dist/leaflet.css';
import React from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, ImageOverlay } from 'react-leaflet';
import { MarkerLayer } from 'react-leaflet-marker';
import L from 'leaflet';
import myIcon from '../map-marker-area.svg';
import { MarkerWithDirection } from '../components/MarkerWithDirection/MarkerWithDirection';
import mapSample from '../assets/maps/b1_22clr.gif';

export function Page2(): React.ReactElement {
    const { id } = useParams();
    const markers: { lat: number; lng: number }[] = [
        { lat: 47.25, lng: 19.25 },
        { lat: 47.23, lng: 19.21 },
        { lat: 47.27, lng: 19.27 },
        { lat: 47.22, lng: 19.22 },
        { lat: 47.21, lng: 19.29 },
        { lat: 47.21, lng: 19.21 },
        { lat: 47.28, lng: 19.2 },
    ];
    const iconPerson: L.Icon = new L.Icon({
        iconUrl: myIcon,
        iconSize: new L.Point(40, 40),
    });
    // eslint-disable-next-line
    const createClusterCustomIcon = function (cluster: unknown) {
        return L.divIcon({
            html: `<span>yolo</span>`,
            className: 'custom-marker-cluster',
            iconSize: L.point(33, 33, true),
        });
    };
    return (
        <div>
            page2 {id}
            <MapContainer center={{ lat: 47.8, lng: 19.9 }} style={{ background: '#ff0000', height: '500px', width: '700px' }} zoom={10}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Marker position={{ lat: 48, lng: 20.7 }} icon={iconPerson}></Marker>
                <Marker position={{ lat: 48.4, lng: 20.5 }} draggable icon={iconPerson}></Marker>
                <ImageOverlay
                    zIndex={0}
                    bounds={[
                        [47, 19],
                        [47.5, 19.5],
                    ]}
                    url={mapSample}
                />
                <MarkerLayer>
                    <>
                        <MarkerWithDirection position={{ lat: 47.2, lng: 19.7 }} direction={45} />
                        <MarkerWithDirection position={{ lat: 47.3, lng: 19.7 }} direction={90} />
                        <MarkerWithDirection position={{ lat: 47.4, lng: 19.7 }} />
                        <MarkerWithDirection position={{ lat: 47, lng: 19 }} />
                        <MarkerWithDirection position={{ lat: 47, lng: 19.5 }} />
                        <MarkerWithDirection position={{ lat: 47.5, lng: 19.5 }} />
                        <MarkerWithDirection position={{ lat: 47.5, lng: 19 }} />
                    </>

                    {markers.map((c, index) => (
                        <MarkerWithDirection key={`${index}-${c.lat}-${c.lng}`} position={[c.lat, c.lng]} />
                    ))}
                </MarkerLayer>
            </MapContainer>
        </div>
    );
}
