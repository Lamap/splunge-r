import '../../node_modules/leaflet/dist/leaflet.css';
import React from 'react';
import { useParams } from 'react-router-dom';
import { SpgMap } from '../components/Map/SpgMap';
export function Page2(): React.ReactElement {
    const { id } = useParams();

    return (
        <div>
            page2 {id}
            <SpgMap />
        </div>
    );
}
