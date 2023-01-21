import './MainPage.scss';
import React, { useEffect, useState } from 'react';
import { SpgMap } from '../components/Map/SpgMap';
import { ISpgPointWithStates } from '../interfaces/ISpgPointWithStates';
import { requestImagesFetch, requestPointsFetch } from '../services/servicesMock';
import { IPointFetchResponse } from 'splunge-common-lib';
import { SpgImageList } from '../components/ImageList/SpgImageList';
import { ISpgImageWithStates } from '../interfaces/ISpgImageWithStates';
import { useNavigate } from 'react-router-dom';
import { NavigateFunction } from 'react-router/dist/lib/hooks';

export function MainPage(): React.ReactElement {
    const [points, setPoints] = useState<ISpgPointWithStates[]>([]);
    // const [selectedPointId, setSelectedPointId] = useState<string>();
    const [images, setImages] = useState<ISpgImageWithStates[]>([]);
    const navigate: NavigateFunction = useNavigate();

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

    function launchImage(imageId: string): void {
        console.log('launch', imageId);
        navigate(`/picture/${imageId}`);
    }
    return (
        <div className="spg-main-page">
            <SpgMap className="spg-main-page__map" isEditing={false} isPointAddingMode={false} points={points} />
            <SpgImageList className="spg-main-page__images" images={images} onLaunchImage={launchImage} points={points} />
        </div>
    );
}
