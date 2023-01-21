import './ImagePage.scss';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { requestFetchImage, requestGetPointOfImage, requestGetPointsByBounds } from '../services/servicesMock';
import { ISpgImage, ISpgPoint, PointOfImageResponse } from 'splunge-common-lib';
import { SpgMap } from '../components/Map/SpgMap';
import { ISpgLatLngBounds } from 'splunge-common-lib/lib/interfaces/ISpgLatLngBounds';

export const ImagePage: React.FC = () => {
    const { id } = useParams();
    const [image, setImage] = useState<ISpgImage>();
    const [pointOfImage, setPointOfImage] = useState<ISpgPoint | null>(null);
    const [pointsOfMap, setPointsOfMap] = useState<ISpgPoint[]>();
    const [bounds, setBounds] = useState<ISpgLatLngBounds>();

    useEffect((): void => {
        console.log(id);
        if (!id) {
            return;
        }
        requestFetchImage(id)
            .then((result: ISpgImage) => {
                console.log(result);
                setImage(result);
            })
            .catch((err: Error) => console.error(err));
        requestGetPointOfImage(id)
            .then((result: PointOfImageResponse) => {
                console.log(result);
                setPointOfImage(result);
            })
            .catch((err: Error) => console.error(err));
    }, [id]);
    useEffect(() => {
        if (!bounds) {
            return;
        }
        console.log(bounds);
        requestGetPointsByBounds(bounds)
            .then((result: ISpgPoint[]): void => {
                setPointsOfMap(result);
            })
            .catch((err: Error) => console.error(err));
    }, [bounds]);
    return (
        <div className="spg-image-page">
            <div className="spg-image-page__image-holder">{!!image && <img className="spg-image-page__img" src={image.url} alt={image.title} />}</div>
            <div className="spg-image-page__data-sidebar">
                title {image?.title}
                points of the map {pointsOfMap?.length}
                {!!pointOfImage && (
                    <SpgMap
                        className="spg-image-page__map"
                        boundsLoaded={(bounds: ISpgLatLngBounds): void => setBounds(bounds)}
                        center={pointOfImage.position}
                        points={[pointOfImage]}
                    />
                )}
            </div>
        </div>
    );
};
