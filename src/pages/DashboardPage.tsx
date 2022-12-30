import '../../node_modules/leaflet/dist/leaflet.css';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { SpgMap } from '../components/Map/SpgMap';
import { ISpgPointClient } from '../interfaces/ISpgPoint';
import { LatLngLiteral } from 'leaflet';

export function DashboardPage(): React.ReactElement {
    const { id } = useParams();

    const [points, setPoints] = useState<ISpgPointClient[]>([
        {
            position: { lat: 47.888, lng: 19.03 },
            id: '2134455',
            direction: 33,
        },
    ]);
    function addPoint(position: LatLngLiteral): void {
        setPoints([...points, { position, id: new Date().getTime().toString() }]);
    }
    function pointClicked(id: string): void {
        console.log(id);
        const adjustedPoints: ISpgPointClient[] = points.map((point: ISpgPointClient): ISpgPointClient => {
            return {
                ...point,
                isSelected: point.id === id,
            };
        });
        setPoints(adjustedPoints);
    }
    return (
        <div>
            page2 {id}
            <SpgMap isEditing={true} points={points} onPointAddedToMap={addPoint} onPointClicked={pointClicked} />
        </div>
    );
}
