import React, { useEffect } from 'react';
import { useMapEvents } from 'react-leaflet';
import { LatLngBounds, LatLngLiteral, LeafletEvent, LeafletMouseEvent, Map } from 'leaflet';
import { ISpgLatLngBounds } from 'splunge-common-lib/lib/interfaces/ISpgLatLngBounds';
interface IProps {
    readonly onClick?: (event: LeafletMouseEvent) => void;
    readonly panTo?: LatLngLiteral;
    readonly onZoomChanged?: (zoom: number) => void;
    readonly boundsLoaded?: (bounds: ISpgLatLngBounds) => void;
    readonly onMapInitialised?: (map: Map) => void;
}
export const MapEventConnector: React.FC<IProps> = ({
    boundsLoaded,
    onClick,
    onMapInitialised,
    onZoomChanged,
    panTo,
}: IProps): React.ReactElement | null => {
    const map: Map = useMapEvents({
        click: (event: LeafletMouseEvent) => !!onClick && onClick(event),
        zoomend: (event: LeafletEvent) => !!onZoomChanged && onZoomChanged(event.target._zoom),
    });
    useEffect(() => {
        console.log(map.getZoom());
        if (!!panTo) {
            const cucc = map.latLngToContainerPoint(panTo);
            console.log(cucc);
            map.setView(panTo, 20, { animate: true });
            const cucc1 = map.latLngToContainerPoint(panTo);
            console.log(cucc1);
        }
    }, [panTo, map]);

    useEffect(() => {
        console.log(':::::::::yoloy', map);
        const bounds: LatLngBounds = map.getBounds();
        !!boundsLoaded &&
            boundsLoaded({
                north: bounds.getNorth(),
                east: bounds.getEast(),
                south: bounds.getSouth(),
                west: bounds.getWest(),
            });
        !!onMapInitialised && onMapInitialised(map);
    }, [map]);
    return null;
};
