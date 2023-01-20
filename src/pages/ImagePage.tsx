import './ImagePage.scss';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { requestFetchImage } from '../services/servicesMock';
import { ISpgImage } from 'splunge-common-lib';
import { SpgMap } from '../components/Map/SpgMap';

export const ImagePage: React.FC = () => {
    const { id } = useParams();
    const [image, setImage] = useState<ISpgImage>();
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
    }, [id]);
    return (
        <div className="spg-image-page">
            <div className="spg-image-page__image-holder">{!!image && <img className="spg-image-page__img" src={image.url} alt={image.title} />}</div>
            <div className="spg-image-page__data-sidebar">
                title {image?.title}
                <SpgMap className="spg-image-page__map" points={[]} />
            </div>
        </div>
    );
};
