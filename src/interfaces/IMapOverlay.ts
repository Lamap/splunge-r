import { LatLngBoundsExpression } from 'leaflet';
export interface IMapOverlayDateRange {
    readonly start?: number;
    readonly end: number;
}
export default interface IMapOverlay {
    readonly id: string;
    readonly url: string;
    readonly name: string;
    readonly dateRange: IMapOverlayDateRange;
    readonly defaultZoom?: number;
    readonly opacity: number;
    readonly minDisplayZoom: number;
    readonly bounds: LatLngBoundsExpression;
}
