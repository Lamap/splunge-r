import IMapOverlay from '../interfaces/IMapOverlay';
export const mapOverlays: IMapOverlay[] = [
    {
        id: '1',
        url: 'https://drive.google.com/uc?id=13pTEiKnFtdQHE12MyOAq7sgLgn-w7DoK',
        dateRange: {
            start: 1875,
            end: 1900,
        },
        name: 'A Tabán 1875 és 1900 között',
        minDisplayZoom: 12,
        opacity: 0,
        bounds: [
            [47.488865, 19.034961],
            [47.495809, 19.04834],
        ],
    },
    {
        id: '2',
        url: 'https://drive.google.com/uc?id=13PGRysannlwu8B49QlYlnC4lhekCdBRh',
        dateRange: {
            start: 1900,
            end: 1933,
        },
        opacity: 0.5,
        name: 'A Tabán 1900 és 1933 között',
        minDisplayZoom: 12,
        bounds: [
            [47.488865, 19.034961],
            [47.495809, 19.04834],
        ],
    },
];
