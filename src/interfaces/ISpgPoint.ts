import { LatLngLiteral } from 'leaflet';

export default interface ISpgPoint {
    readonly position: LatLngLiteral;
    readonly direction?: number;
    readonly id: string;
}
export interface ISpgPointClient extends ISpgPoint {
    readonly isSelected?: boolean;
}
