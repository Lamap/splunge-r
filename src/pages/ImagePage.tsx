import './ImagePage.scss';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { requestFetchImage, requestGetPointOfImage, requestGetPointsByBounds } from '../services/services';
import { DateFormat, ISpgImage, ISpgPoint, PointOfImageResponse } from 'splunge-common-lib';
import { SpgMap } from '../components/Map/SpgMap';
import { ISpgLatLngBounds } from 'splunge-common-lib/lib/interfaces/ISpgLatLngBounds';
import LaunchIcon from '@mui/icons-material/Launch';
import { NavigateFunction } from 'react-router/dist/lib/hooks';
import { ArrayParam, useQueryParams, withDefault } from 'use-query-params';
import queryString from 'query-string';
import IMapOverlay from '../interfaces/IMapOverlay';
import getOverlaysFromQuery from '../utils/getOverlaysFromQuery';
import { QueryParamConfig } from 'serialize-query-params/src/types';
import { SpgPage } from '../components/SpgPage/SpgPage';
import { AxiosError } from 'axios/index';
import { ToastMessage } from '../components/ToastMessage/ToastMessage';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation('common');
    const date: string = [image?.date?.start, ...(image?.date?.type === DateFormat.RANGE && !!image.date.end ? [image?.date?.end] : [])].join(' - ');

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
                setErrorToast(t('imageEndPage.pointOfImageLoadError') || '');
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            return t('imageEndPage.noKeyWordsValue');
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
                    <div className="spg-image-page__description-label">{t('imageEndPage.descriptionLabel')}</div>
                    <div className="spg-image-page__value">{image?.title || t('imageEndPage.titlePlaceholder')}</div>
                    <div className="spg-image-page__description">{image?.description || t('imageEndPage.descriptionPlaceholder')}</div>
                    <div className="spg-image-page__description-label">{t('imageEndPage.dateLabel')}</div>
                    <div className="spg-image-page__value">{date || t('imageEndPage.datePlaceholder')}</div>
                    <div className="spg-image-page__description-label">{t('imageEndPage.keywordsLabel')}</div>
                    <div className="spg-image-page__value">{getKeyWords()}</div>

                    <div className="spg-image-page__description-label spg-image-page__localization">{t('imageEndPage.localizationLabel')}</div>
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
                                <div className="spg-image-page__map-info">
                                    <b>{pointsOfMap?.length}</b> {t('imageEndPage.markersOnTheView')}
                                </div>
                            </div>
                        </>
                    )}
                    {!pointOfImage && <div className="spg-image-page__no-point-info">{t('imageEndPage.noMarker')}</div>}
                    <button className="spg-image-page__map-link" onClick={goToMap}>
                        {t('imageEndPage.goAndSeeOnMap')}
                        <LaunchIcon fontSize={'small'} />
                    </button>
                </div>
            </div>
        </SpgPage>
    );
};
