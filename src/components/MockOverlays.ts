import IMapOverlay from '../interfaces/IMapOverlay';
import mapSample from '../assets/maps/b1_22clr.gif';
export const mapOverlays: IMapOverlay[] = [
    {
        id: '1',
        url: mapSample,
        dateRange: {
            start: 1875,
            end: 1900,
        },
        name: 'A Tabán 1875 és 1900 között',
        minDisplayZoom: 10,
        bounds: [
            [47.488865, 19.034961],
            [47.495809, 19.04834],
        ],
    },
    {
        id: '2',
        url: mapSample,
        dateRange: {
            start: 1900,
            end: 1933,
        },
        name: 'A Tabán 1900 és 1933 között',
        minDisplayZoom: 10,
        bounds: [
            [47.488865, 19.034961],
            [47.495809, 19.04834],
        ],
    },
];
