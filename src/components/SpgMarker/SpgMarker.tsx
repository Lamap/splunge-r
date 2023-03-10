import './SpgMarker.scss';
import React from 'react';
import L, { LatLngLiteral } from 'leaflet';
import { Marker } from 'react-leaflet';
import { SpgMarkerIconElement } from './SpgMarkerIconElement';
interface IProps {
    readonly direction?: number;
    readonly hasDirection?: boolean;
    readonly isDraggable?: boolean;
    readonly isHighlighted?: boolean;
    readonly isPointAddingMode?: boolean;
    readonly isSelected?: boolean;
    readonly onClick?: () => void;
    readonly onDragEnd?: (newPosition: LatLngLiteral) => void;
    readonly position: L.LatLngExpression;
    readonly showCountOnlyOnHover?: boolean;
    readonly connectedImageCount?: number;
}

export const SpgMarker: React.FC<IProps> = ({
    direction = 0,
    hasDirection,
    isDraggable,
    isHighlighted,
    isPointAddingMode,
    isSelected,
    onClick,
    onDragEnd,
    position,
    showCountOnlyOnHover,
    connectedImageCount,
}: IProps): React.ReactElement => {
    const markerSize: number = 42;

    const customIcon: L.DivIcon = new L.DivIcon({
        html: SpgMarkerIconElement({
            isHighlighted,
            rotation: direction,
            isSelected,
            isPointAddingMode,
            hasDirection,
            connectedImageCount,
            showCountOnlyOnHover,
        }),
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
