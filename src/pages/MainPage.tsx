import './MainPage.scss';
import React, { useEffect, useState } from 'react';
import { SpgMap } from '../components/Map/SpgMap';
import { ISpgPointWithStates } from '../interfaces/ISpgPointWithStates';
import { requestImagesFetch, requestPointsFetch } from '../services/servicesMock';
import { IPointFetchResponse } from 'splunge-common-lib';
import { SpgImageList } from '../components/ImageList/SpgImageList';
import { ISpgImageWithStates } from '../interfaces/ISpgImageWithStates';

export function MainPage(): React.ReactElement {
    const [points, setPoints] = useState<ISpgPointWithStates[]>([]);
    // const [selectedPointId, setSelectedPointId] = useState<string>();
    const [images, setImages] = useState<ISpgImageWithStates[]>([]);

    useEffect((): void => {
        requestPointsFetch()
            .then((pointsResult: IPointFetchResponse) => {
                setPoints(pointsResult);
            })
            .catch((err: Error) => {
                console.error(err);
            });
        requestImagesFetch()
            .then(imagesResult => setImages(imagesResult))
            .catch((err: Error) => {
                console.error(err);
            });
    }, []);
    return (
        <div className="spg-main-page">
            <SpgMap className="spg-main-page__map" isEditing={false} isPointAddingMode={false} points={points} />
            <SpgImageList className="spg-main-page__images" images={images} />
        </div>
    );
}
