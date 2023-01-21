import React, { useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import { LatLngBounds, LatLngLiteral, LeafletEvent, LeafletMouseEvent, Map } from 'leaflet';
import { ISpgLatLngBounds } from 'splunge-common-lib/lib/interfaces/ISpgLatLngBounds';
interface IProps {
    readonly onClick?: (event: LeafletMouseEvent) => void;
    readonly panTo?: LatLngLiteral;
    readonly onZoomChanged?: (zoom: number) => void;
    readonly boundsLoaded?: (bounds: ISpgLatLngBounds) => void;
}
export const MapEventConnector: React.FC<IProps> = ({ boundsLoaded, onClick, onZoomChanged, panTo }: IProps): React.ReactElement | null => {
    const map: Map = useMapEvents({
        click: (event: LeafletMouseEvent) => !!onClick && onClick(event),
        zoomend: (event: LeafletEvent) => !!onZoomChanged && onZoomChanged(event.target._zoom),
    });
    useEffect(() => {
        console.log(map.getZoom());
        if (!!panTo) {
            map.setView(panTo, 20, { animate: true });
            map.getBounds();
        }
    }, [panTo, map]);

    useEffect(() => {
        console.log(map.getBounds().getSouth());
        const bounds: LatLngBounds = map.getBounds();
        !!boundsLoaded &&
            boundsLoaded({
                north: bounds.getNorth(),
                east: bounds.getEast(),
                south: bounds.getSouth(),
                west: bounds.getWest(),
            });
    }, [map]);
    return null;
};
