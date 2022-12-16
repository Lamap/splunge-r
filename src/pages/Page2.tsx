import React from 'react';
import { useParams } from 'react-router-dom';

export function Page2(): React.ReactElement {
    const { id } = useParams();
    return <div>page2 {id}</div>;
}
