import './MainPage.scss';
import React, { useEffect, useState } from 'react';
import { SpgMap } from '../components/Map/SpgMap';
import { ISpgPointWithStates } from '../interfaces/ISpgPointWithStates';
import { requestPointsFetch } from '../services/servicesMock';
import { IPointFetchResponse } from 'splunge-common-lib';

export function MainPage(): React.ReactElement {
    const [points, setPoints] = useState<ISpgPointWithStates[]>([]);
    // const [selectedPointId, setSelectedPointId] = useState<string>();

    useEffect((): void => {
        requestPointsFetch()
            .then((pointsResult: IPointFetchResponse) => {
                setPoints(pointsResult);
            })
            .catch((err: Error) => {
                console.error(err);
            });
    }, []);
    return (
        <div className="spg-main-page">
            <SpgMap className="spg-main-page__map" isEditing={false} isPointAddingMode={false} points={points} />
        </div>
    );
}
