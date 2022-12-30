import React from 'react';
import { useMapEvents } from 'react-leaflet';
import { LeafletMouseEvent } from 'leaflet';
interface IProps {
    readonly onClick?: (event: LeafletMouseEvent) => void;
}
export const MapEventConnector: React.FC<IProps> = ({ onClick }): React.ReactElement | null => {
    const map = useMapEvents({
        click: (event: LeafletMouseEvent) => !!onClick && onClick(event),
    });
    console.log(map);
    return null;
};
