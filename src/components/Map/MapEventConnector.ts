import React, { useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import { LatLngLiteral, LeafletEvent, LeafletMouseEvent, Map } from 'leaflet';
interface IProps {
    readonly onClick?: (event: LeafletMouseEvent) => void;
    readonly panTo?: LatLngLiteral;
    readonly onZoomChanged?: (zoom: number) => void;
}
export const MapEventConnector: React.FC<IProps> = ({ onClick, onZoomChanged, panTo }: IProps): React.ReactElement | null => {
    const map: Map = useMapEvents({
        click: (event: LeafletMouseEvent) => !!onClick && onClick(event),
        zoomend: (event: LeafletEvent) => !!onZoomChanged && onZoomChanged(event.target._zoom),
    });
    useEffect(() => {
        console.log(map.getZoom());
        if (!!panTo) {
            map.setView(panTo, 20, { animate: true });
        }
    }, [panTo, map]);

    return null;
};
