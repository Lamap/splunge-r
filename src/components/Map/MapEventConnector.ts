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
        console.log(map.getZoom());
        if (!!panTo) {
            map.setView(panTo, 20, { animate: true });
        }
    }, [panTo, map]);
    return null;
};
