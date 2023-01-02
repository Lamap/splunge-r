import { LatLngLiteral } from 'leaflet';

export default interface ISpgPoint {
    readonly position: LatLngLiteral;
    readonly hasDirection?: boolean;
    readonly direction?: number;
    readonly images: string[];
    readonly id: string;
}
export interface ISpgPointClient extends ISpgPoint {
    readonly isSelected?: boolean;
    readonly isHighlighted?: boolean;
}
