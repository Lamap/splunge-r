import './ImagePage.scss';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { requestFetchImage, requestGetPointOfImage, requestGetPointsByBounds } from '../services/services';
import { ISpgImage, ISpgPoint, PointOfImageResponse } from 'splunge-common-lib';
import { SpgMap } from '../components/Map/SpgMap';
import { ISpgLatLngBounds } from 'splunge-common-lib/lib/interfaces/ISpgLatLngBounds';
import LaunchIcon from '@mui/icons-material/Launch';
import { NavigateFunction } from 'react-router/dist/lib/hooks';
import { useQueryParams, ArrayParam, withDefault } from 'use-query-params';
import queryString from 'query-string';
import IMapOverlay from '../interfaces/IMapOverlay';
import getOverlaysFromQuery from '../utils/getOverlaysFromQuery';
import { QueryParamConfig } from 'serialize-query-params/src/types';
import { SpgPage } from '../components/SpgPage/SpgPage';
import { AxiosError } from 'axios/index';
import { ToastMessage } from '../components/ToastMessage/ToastMessage';

export const ImagePage: React.FC = () => {
    const { id } = useParams();
    const [image, setImage] = useState<ISpgImage>();
    const [pointOfImage, setPointOfImage] = useState<ISpgPoint | null>(null);
    const [pointsOfMap, setPointsOfMap] = useState<ISpgPoint[]>();
    const [bounds, setBounds] = useState<ISpgLatLngBounds>();
    const navigate: NavigateFunction = useNavigate();
    const OverlayIdParam: QueryParamConfig<(string | null)[]> = withDefault(ArrayParam, []);
    const OverlayOpacityParam: QueryParamConfig<(string | null)[]> = withDefault(ArrayParam, []);
    const [query, setQuery] = useQueryParams({
        overlayIds: OverlayIdParam,
        overlayOpacities: OverlayOpacityParam,
    });
    const overlaysFromQuery: IMapOverlay[] = getOverlaysFromQuery(query.overlayIds, query.overlayOpacities);
    const [isPageLoading, setIsPageLoading] = useState<boolean>(false);
    const [pageError, setPageError] = useState<AxiosError | undefined>();
    const [errorToast, setErrorToast] = useState<string>();

    useEffect((): void => {
        console.log(id);
        if (!id) {
            return;
        }
        setIsPageLoading(true);
        requestFetchImage(id)
            .then((result: ISpgImage) => {
                setImage(result);
            })
            .catch((err: AxiosError): void => {
                setPageError(err);
            })
            .finally((): void => {
                setIsPageLoading(false);
            });
        requestGetPointOfImage(id)
            .then((result: PointOfImageResponse) => {
                setPointOfImage(result);
            })
            .catch((err: Error): void => {
                setErrorToast('Could not load points of the image');
            });
    }, [id]);
    useEffect(() => {
        if (!bounds) {
            return;
        }
        requestGetPointsByBounds(bounds)
            .then((result: ISpgPoint[]): void => {
                setPointsOfMap(result);
            })
            .catch((err: Error) => console.error(err));
    }, [bounds]);

    function goToMap(): void {
        setQuery({
            overlayIds: ['aasssss', 'asdasdiii'],
            overlayOpacities: ['10', '40'],
        });
        const query: string = queryString.stringify({
            overlays: [
                { id: 'bela', yolo: 'jeno' },
                { id: 'sss', yolo: 'kkkk' },
            ],
        });
        navigate(`/?${query}`);
    }

    function getKeyWords(): string {
        if (!image?.tags?.length) {
            return 'No keywords';
        }
        return image?.tags?.join(', ');
    }
    return (
        <SpgPage isLoading={isPageLoading} error={pageError}>
            <div className="spg-image-page">
                {!!errorToast && <ToastMessage severity={'error'} message={errorToast} onClose={(): void => setErrorToast(undefined)} />}
                <div className="spg-image-page__image-holder">
                    {!!image && <img className="spg-image-page__img" src={image.url} alt={image.title} />}
                </div>
                <div className="spg-image-page__data-sidebar">
                    <div className="spg-image-page__description-label">Leírás</div>
                    <div className="spg-image-page__value">{image?.title}</div>
                    <div className="spg-image-page__description">{image?.description}</div>
                    <div className="spg-image-page__description-label">Év</div>
                    <div className="spg-image-page__value">1923</div>
                    <div className="spg-image-page__description-label">Kulcsszavak</div>
                    <div className="spg-image-page__value">{getKeyWords()}</div>

                    <div className="spg-image-page__description-label spg-image-page__localization">Localization</div>
                    {!!pointOfImage && (
                        <>
                            <SpgMap
                                className="spg-image-page__map"
                                boundsLoaded={(bounds: ISpgLatLngBounds): void => setBounds(bounds)}
                                center={pointOfImage.position}
                                isInteractionDisabled={true}
                                points={[pointOfImage]}
                                markersCountShowOnlyOnHover={true}
                                hideOverlayControl={true}
                                initialOverlays={overlaysFromQuery}
                            />

                            <div className="spg-image-page__map-instructions">
                                <button className="spg-image-page__map-link" onClick={goToMap}>
                                    Check it on the map <LaunchIcon fontSize={'small'} />
                                </button>
                                <div className="spg-image-page__map-info">
                                    <b>{pointsOfMap?.length}</b> markers on this view
                                </div>
                            </div>
                        </>
                    )}
                    {!pointOfImage && (
                        <div>
                            No image connected to this point
                            <button className="spg-image-page__map-link" onClick={goToMap}>
                                Go to the map <LaunchIcon fontSize={'small'} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </SpgPage>
    );
};
