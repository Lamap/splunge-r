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
    readonly onMoveStart?: () => void;
    readonly onMove?: () => void;
}
export const MapEventConnector: React.FC<IProps> = ({
    boundsLoaded,
    onClick,
    onMapInitialised,
    onZoomChanged,
    onMoveStart,
    onMove,
    panTo,
}: IProps): React.ReactElement | null => {
    const map: Map = useMapEvents({
        click: (event: LeafletMouseEvent) => !!onClick && onClick(event),
        zoomend: (event: LeafletEvent) => !!onZoomChanged && onZoomChanged(event.target._zoom),
        movestart: () => !!onMoveStart && onMoveStart(),
        move: () => !!onMove && onMove(),
    });
    useEffect(() => {
        if (!!panTo) {
            map.setView(panTo, 20, { animate: true });
        }
    }, [panTo, map]);

    useEffect(() => {
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
