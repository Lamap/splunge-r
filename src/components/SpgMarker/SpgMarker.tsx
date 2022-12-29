import './SpgMarker.scss';
import React from 'react';
import L from 'leaflet';
import { Marker } from 'react-leaflet';
import { SpgMarkerIconElement } from './SpgMarkerIconElement';
interface IProps {
    readonly direction?: number;
    readonly isDraggable?: boolean;
    readonly isHighLighted?: boolean;
    readonly onClick?: () => void;
    readonly onDragEnd?: (newPosition: L.LatLngExpression) => void;
    readonly position: L.LatLngExpression;
}

export const SpgMarker: React.FC<IProps> = ({ direction = 0, isDraggable, isHighLighted, onClick, onDragEnd, position }): React.ReactElement => {
    const markerSize: number = 32;
    console.log(isHighLighted);
    const customIcon: L.DivIcon = new L.DivIcon({
        html: SpgMarkerIconElement(direction, !!isHighLighted),
        iconSize: new L.Point(markerSize, markerSize),
        iconAnchor: new L.Point(markerSize / 2, markerSize / 2),
        className: 'spg-marker__icon',
    });

    function onMarkerClicked(): void {
        !!onClick && onClick();
    }
    function dragend(event: L.DragEndEvent): void {
        !!onDragEnd && onDragEnd(event.target.getLatLng());
    }
    return (
        <Marker position={position} draggable={isDraggable} icon={customIcon} eventHandlers={{ click: onMarkerClicked, dragend: dragend }}></Marker>
    );
};
