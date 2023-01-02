import React, { useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import { LatLngLiteral, LeafletMouseEvent } from 'leaflet';
interface IProps {
    readonly onClick?: (event: LeafletMouseEvent) => void;
    readonly panTo?: LatLngLiteral;
}
export const MapEventConnector: React.FC<IProps> = ({ onClick, panTo }): React.ReactElement | null => {
    const map = useMapEvents({
        click: (event: LeafletMouseEvent) => !!onClick && onClick(event),
    });
    useEffect(() => {
        if (!!panTo) {
            map.setView(panTo, map.getZoom(), { animate: true });
        }
    }, [panTo, map]);
    return null;
};
