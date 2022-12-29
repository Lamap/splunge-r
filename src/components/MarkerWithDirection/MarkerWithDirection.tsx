import './MarkerWithDirection.scss';
import React from 'react';
import { Marker } from 'react-leaflet-marker';
import L from 'leaflet';

interface IProps {
    readonly direction?: number;
    readonly onClick?: () => void;
    readonly position: L.LatLngExpression;
}
export const MarkerWithDirection: React.FC<IProps> = ({ direction = 0, onClick, position }) => {
    function onMarkerClick(): void {
        console.log('markerClicked');
        !!onClick && onClick();
    }
    return (
        <Marker position={position} interactive placement={'center'}>
            <div className="spg--marker-with-direction">
                <div className="spg--marker-with-direction__panorama" style={{ transform: `rotate(${direction}deg)` }}></div>
                <button className="spg--marker-with-direction__point" onClick={onMarkerClick}></button>
            </div>
        </Marker>
    );
};
