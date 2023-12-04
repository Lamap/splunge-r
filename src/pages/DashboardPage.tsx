import '../../node_modules/leaflet/dist/leaflet.css';
import './DashboardPage.scss';
import React, { SyntheticEvent, useEffect, useState } from 'react';
import { SpgMap } from '../components/Map/SpgMap';
import { ISpgPointWithStates } from '../interfaces/ISpgPointWithStates';
import { LatLngLiteral } from 'leaflet';
import { Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Slider } from '@mui/material';
import { ISpgImageWithStates } from '../interfaces/ISpgImageWithStates';
import { DashboardImageList } from '../components/DashboardImageList/DashboardImageList';
import { IImageDeleteResponse, IPointAttachResponse, IPointDeleteResponse, IPointDetachResponse, ISpgImage, ISpgPoint } from 'splunge-common-lib';

import {
    requestAttachImageToPoint,
    requestCreateNewImage,
    requestCreatePointForImage,
    requestDeleteImage,
    requestDeletePoint,
    requestDetachImageFromPoint,
    requestUpdatePoint,
    requestPointsFetch,
    requestImagesFetch,
    requestUpdateImage,
} from '../services/services';
import { SpgPage } from '../components/SpgPage/SpgPage';
import { AxiosError } from 'axios';
import { ServerSleepNotification } from '../components/ServerSleepNotification/ServerSleepNotification';
import { ToastMessage } from '../components/ToastMessage/ToastMessage';
import { DashboardImageEditor } from '../components/DashboarImageEditor/DashboardImageEditor';
import { useTranslation } from 'react-i18next';
import { CustomSliderOverwrite } from '../components/General/CustomSliderOverwrites/CustomSliderOverwrite';

interface IDashboardWarning {
    readonly title: string;
    readonly text?: string;
    readonly acknowledgeLabel: string;
}
interface IDashboardConfirmation {
    readonly title: string;
    readonly text?: string;
    readonly applyLabel: string;
    readonly cancelLabel: string;
    readonly applyFunction: () => void;
}
export function DashboardPage(): React.ReactElement {
    const [selectedPointId, setSelectedPointId] = useState<string>();
    const [selectedImageId, setSelectedImageId] = useState<string>();
    const [panTo, setPanTo] = useState<LatLngLiteral>();
    const [warning, setWarning] = useState<IDashboardWarning | null>(null);
    const [confirmation, setConfirmation] = useState<IDashboardConfirmation | null>(null);
    const [editedImage, setEditedImage] = useState<ISpgImage>();
    const [points, setPoints] = useState<ISpgPointWithStates[]>([]);
    const [images, setImages] = useState<ISpgImageWithStates[]>([]);
    const [pageError, setPageError] = useState<AxiosError | undefined>();
    const [pageIsLoading, setPageisLoading] = useState<boolean>(false);
    const [showServerSleepNotification, setShowServerSleepNotification] = useState<boolean>(false);
    const serverDelayTolerance: number = Number(process.env.REACT_API_DELAY_TOLERANCE) || 4000;
    const [errorToast, setErrorToast] = useState<string>();
    const { t } = useTranslation('common');

    useEffect((): void => {
        const delayCheckTimer: number = window.setTimeout((): void => setShowServerSleepNotification(true), serverDelayTolerance);
        setPageisLoading(true);
        Promise.all([requestImagesFetch(), requestPointsFetch()])
            .then(([fetchedImages, allPoints]): void => {
                setImages(fetchedImages);
                setPoints(allPoints);
            })
            .catch((err: AxiosError) => setPageError(err))
            .finally((): void => {
                window.clearTimeout(delayCheckTimer);
                setPageisLoading(false);
                setShowServerSleepNotification(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function createPointForImage(position: LatLngLiteral): Promise<void> {
        clearPointHighlighting();
        if (!!selectedImageId) {
            try {
                setPageisLoading(true);
                const updatedPointExtendedByTheNew: ISpgPoint[] = await requestCreatePointForImage(position, selectedImageId);
                setPageisLoading(false);
                setPoints(updatedPointExtendedByTheNew);
            } catch (err) {
                console.error(err);
                setErrorToast(t('dashboardErrors.couldNotCreatePoint') || '');
            }
        }
        setSelectedImageId(undefined);
    }

    async function pointClicked(id: string): Promise<void> {
        // if the selectedImageId is not set we set the point state to selected
        if (!selectedImageId) {
            setSelectedPointId(id);
            const selectedPoint: ISpgPointWithStates | undefined = getSelectedPoint(id);
            setImages(
                images.map((image: ISpgImageWithStates) => {
                    return {
                        ...image,
                        isHighlighted: selectedPoint?.images.includes(image.id),
                    };
                }),
            );
            const adjustedPoints: ISpgPointWithStates[] = points.map((point: ISpgPointWithStates): ISpgPointWithStates => {
                return {
                    ...point,
                    isSelected: point.id === id,
                    isHighlighted: false,
                };
            });
            setPoints(adjustedPoints);

            return;
        }
        // if selectedImageId is set we add the image to the point
        if (getSelectedPoint(id)?.images.includes(selectedImageId)) {
            setWarning({
                acknowledgeLabel: t('dashboard.warnings.imageAlreadyLinkedAcknowledgeLabel'),
                title: t('dashboard.warnings.imageAlreadyLinkedTitle'),
                text: t('dashboard.warnings.imageAlreadyLinkedExplanation') || '',
            });
            return console.warn('This point has been already connected to the selected image.');
        }
        return await addImageToPoint(id);
    }
    function clearPointSelection(): void {
        setSelectedPointId(undefined);
        setImages(
            images.map((image: ISpgImageWithStates) => {
                return {
                    ...image,
                    isHighlighted: false,
                };
            }),
        );
        const adjustedPoints: ISpgPointWithStates[] = points.map((point: ISpgPointWithStates): ISpgPointWithStates => {
            return {
                ...point,
                isSelected: false,
            };
        });
        setPoints(adjustedPoints);
    }
    function clearPointHighlighting(): void {
        const adjustedPoints: ISpgPointWithStates[] = points.map((point: ISpgPointWithStates): ISpgPointWithStates => {
            return {
                ...point,
                isHighlighted: false,
            };
        });
        setPoints(adjustedPoints);
    }
    function onDirectionChanged(event: Event | SyntheticEvent<Element, Event>, value: number | number[]): void {
        const selectedPoint: ISpgPoint | undefined = getSelectedPoint(selectedPointId);
        if (!selectedPoint) {
            return;
        }
        updatePoint({ ...selectedPoint, direction: value as number });
    }
    function onHasDirectionChanged(event: React.SyntheticEvent, checked: boolean): void {
        const selectedPoint: ISpgPoint | undefined = getSelectedPoint(selectedPointId);
        if (!selectedPoint) {
            return;
        }
        updatePoint({ ...selectedPoint, hasDirection: checked });
    }
    async function onPointPositionChanged(id: string, newPosition: LatLngLiteral): Promise<void> {
        const pointToUpdate: ISpgPoint | undefined = points.find((point: ISpgPointWithStates) => point.id === id);
        if (!pointToUpdate) {
            return;
        }
        await updatePoint({ ...pointToUpdate, position: newPosition });
    }
    function updatePoint(modifiedPoint: ISpgPoint): void {
        setPageisLoading(true);
        requestUpdatePoint(modifiedPoint)
            .then((updatedPoint: ISpgPoint) => {
                const updatedPoints: ISpgPointWithStates[] = points.map((point: ISpgPointWithStates) => {
                    if (point.id === modifiedPoint.id) {
                        return { ...updatedPoint, isSelected: modifiedPoint.id === selectedPointId };
                    }
                    return point;
                });
                setPoints(updatedPoints);
                setPageisLoading(false);
            })
            .catch((err: Error): void => {
                setPageisLoading(false);
                setErrorToast(t('dashboard.couldNotUpdatePoint') || '');
            });
    }
    function getSelectedPoint(selectedId: string | undefined): ISpgPointWithStates | undefined {
        return points.find(({ id }: ISpgPointWithStates) => id === selectedId);
    }
    function deletePoint(): void {
        if (!selectedPointId) {
            return;
        }

        setConfirmation({
            applyFunction: (): void => {
                setPageisLoading(true);
                requestDeletePoint(selectedPointId)
                    .then((result: IPointDeleteResponse) => {
                        setPoints(points.filter((point: ISpgPointWithStates) => point.id !== result.deletedPointId));
                        setPageisLoading(false);
                    })
                    .catch((err: Error): void => {
                        setPageisLoading(false);
                        setErrorToast(t('dashboard.couldNotDeletePoint') || '');
                    });
                closeConfirmation();
            },
            title: t('dashboard.deletePointConfirmation.title'),
            applyLabel: t('dashboard.deletePointConfirmation.apply'),
            cancelLabel: t('general.cancel'),
        });
    }
    function detachImageFromPoint(selectedImageId: string): void {
        console.log('detach', selectedImageId);
        setPageisLoading(true);
        requestDetachImageFromPoint(selectedImageId)
            .then((updatedPoint: IPointDetachResponse) => {
                const updatedPoints: ISpgPoint[] = points.map((point: ISpgPoint) => {
                    if (updatedPoint.id === point.id) {
                        return updatedPoint;
                    }
                    return point;
                });
                setPoints(updatedPoints);
                setPageisLoading(false);
            })
            .catch((err: Error): void => {
                setPageisLoading(false);
                setErrorToast(t('dashboard.couldNotRemoveImage') || '');
            });
    }
    function startConnectImageToPointProcess(id: string): void {
        console.log('startConnectImageToPointProcess', id);
        clearPointHighlighting();
        setSelectedImageId(id);
        clearPointSelection();
    }
    function quitImageConnection(): void {
        setSelectedImageId(undefined);
        clearPointSelection();
    }
    async function addImageToPoint(pointId: string): Promise<void> {
        console.log('addImage to point');
        if (!selectedImageId) {
            return;
        }
        setPageisLoading(true);
        try {
            const changedPoints: IPointAttachResponse = await requestAttachImageToPoint(pointId, selectedImageId);
            setPageisLoading(false);

            setPoints(
                points.map((point: ISpgPointWithStates) => {
                    const pointToUpdate: ISpgPoint | undefined = changedPoints.find((changedPoint: ISpgPoint) => point.id === changedPoint.id);
                    return pointToUpdate || point;
                }),
            );
            setSelectedImageId(undefined);
        } catch (err) {
            setPageisLoading(false);
            setErrorToast(t('dashboard.failedToAddImageToPoint') || '');
        }
    }
    function highlightPointOfImage(imageId: string): void {
        const attachedPoint: ISpgPointWithStates | undefined = points.find((point: ISpgPointWithStates) => point.images.includes(imageId));
        if (attachedPoint) {
            const adjustedPoints: ISpgPointWithStates[] = points.map((point: ISpgPointWithStates): ISpgPointWithStates => {
                return {
                    ...point,
                    isHighlighted: point.id === attachedPoint.id,
                };
            });
            setPoints(adjustedPoints);
            setPanTo(attachedPoint.position);
        }
    }

    function addNewImage(file: File, widthPerHeightRatio: number): void {
        console.log('add new image', file);
        setPageisLoading(true);
        requestCreateNewImage(file, widthPerHeightRatio)
            .then((newImage: ISpgImage) => {
                setImages([newImage, ...images]);
                setPageisLoading(false);
            })
            .catch((err: Error): void => {
                setPageisLoading(false);
                setErrorToast(t('dashboard.errors.couldNotCreateImage') || '');
            });
    }

    function deleteImage(imageToDeleteId: string): void {
        setConfirmation({
            applyFunction: (): void => {
                setPageisLoading(true);
                requestDeleteImage(imageToDeleteId)
                    .then((result: IImageDeleteResponse) => {
                        setImages(images.filter((image: ISpgImageWithStates) => image.id !== imageToDeleteId));
                        const updatedPoints: ISpgPoint[] = points.map((point: ISpgPoint): ISpgPoint => {
                            const updatedPoint: ISpgPoint | undefined = result.updatedPoints.find(({ id }: ISpgPoint) => point.id === id);
                            return updatedPoint || point;
                        });
                        setPoints(updatedPoints);
                        setPageisLoading(false);
                    })
                    .catch((err: Error): void => {
                        setPageisLoading(false);
                        setErrorToast(t('dashboard.errors.couldNotDeleteImage') || '');
                    });
                setConfirmation(null);
            },
            cancelLabel: t('general.cancel'),
            applyLabel: t('dashboard.deleteImageConfirmation.apply'),
            title: t('dashboard.deleteImageConfirmation.title'),
        });
    }
    function closeWarningDialog(): void {
        setWarning(null);
    }
    function closeConfirmation(): void {
        setConfirmation(null);
    }

    function editImage(image: ISpgImage): void {
        setEditedImage({ ...image });
    }
    function saveEditedImage(updatedImage: ISpgImage): void {
        if (!updatedImage) {
            return;
        }
        try {
            setPageisLoading(true);
            requestUpdateImage(updatedImage).then((result: ISpgImage): void => {
                setImages(
                    images.map((image: ISpgImageWithStates) => {
                        if (image.id === result?.id) {
                            return result;
                        }
                        return image;
                    }),
                );
                setPageisLoading(false);
            });
        } catch (err) {
            setPageisLoading(false);
            setErrorToast(t('dashboard.errors.couldNotSaveImageData') || '');
            console.error(err);
        }

        setEditedImage(undefined);
    }

    return (
        <SpgPage isLoading={pageIsLoading} error={pageError}>
            <div className="spg-dashboard">
                {!!errorToast && <ToastMessage severity={'error'} message={errorToast} onClose={(): void => setErrorToast(undefined)} />}
                <ServerSleepNotification isOpen={showServerSleepNotification} onClose={(): void => setShowServerSleepNotification(false)} />
                <div className="spg-dashboard__map-and-actions">
                    <div className={'spg-dashboard__actions'}>
                        {!selectedPointId && !selectedImageId && (
                            <div>
                                <div className="spg-dashboard__editing-header">{t('dashboard.instructions.header')}</div>
                                <ul>
                                    <li>{t('dashboard.instructions.point1')}</li>
                                    <li>{t('dashboard.instructions.point2')}</li>
                                    <li>{t('dashboard.instructions.point3')}</li>
                                </ul>
                            </div>
                        )}
                        {!!selectedPointId && (
                            <>
                                <div className="spg-dashboard__editing-header">
                                    {t('dashboard.pointSelectionState', { count: getSelectedPoint(selectedPointId)?.images.length })}
                                </div>
                                <div>{t('dashboard.pointSelectionInstruction')}</div>
                                <div className="spg-dashboard__direction-group">
                                    <FormControlLabel
                                        label={t('dashboard.hasDirectionLabel')}
                                        onChange={onHasDirectionChanged}
                                        control={<Checkbox name={'hasdirection'} checked={!!getSelectedPoint(selectedPointId)?.hasDirection} />}
                                    />
                                    {getSelectedPoint(selectedPointId)?.hasDirection && (
                                        <div className="spg-dashboard__direction-slider">
                                            <CustomSliderOverwrite
                                                postFix={'degree'}
                                                child={
                                                    <Slider
                                                        min={0}
                                                        max={360}
                                                        size="small"
                                                        onChangeCommitted={onDirectionChanged}
                                                        defaultValue={getSelectedPoint(selectedPointId)?.direction}
                                                        valueLabelDisplay="on"
                                                        valueLabelFormat={(): React.ReactElement => (
                                                            <span className={'yolo'}>{getSelectedPoint(selectedPointId)?.direction}</span>
                                                        )}
                                                    />
                                                }
                                            />
                                        </div>
                                    )}
                                    <span className="spg-dashboard__delete-point-btn">
                                        <Button
                                            variant={'outlined'}
                                            color={'error'}
                                            size={'small'}
                                            onClick={deletePoint}
                                            disabled={!!getSelectedPoint(selectedPointId)?.images.length}
                                        >
                                            {t('dashboard.deletePointLabel')}
                                        </Button>
                                    </span>

                                    <Button variant={'outlined'} size={'small'} onClick={clearPointSelection}>
                                        {t('dashboard.releasePointLabel')}
                                    </Button>
                                </div>
                            </>
                        )}
                        {!!selectedImageId && (
                            <div>
                                <div className="spg-dashboard__editing-header">You have selected an image.</div>
                                Now you can connect the image to a point by clicking on the marker or click on the map to create a new point and link
                                to the selected image.
                                <div className="spg-dashboard__point-connect-actions">
                                    <Button variant={'outlined'} size={'small'} onClick={quitImageConnection}>
                                        {t('dashboard.quitPointConnection')}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                    <SpgMap
                        className="spg-dashboard__map"
                        isEditing={true}
                        isPointAddingMode={!!selectedImageId}
                        panTo={panTo}
                        points={points}
                        onMapClicked={createPointForImage}
                        onPointClicked={pointClicked}
                        onPointMoved={onPointPositionChanged}
                    />
                </div>
                <DashboardImageList
                    images={images}
                    className="spg-dashboard__image-list"
                    onConnectImageToPoint={startConnectImageToPointProcess}
                    onChangePointOfImage={startConnectImageToPointProcess}
                    onDeleteImage={deleteImage}
                    onDetachImageFromPoint={detachImageFromPoint}
                    onEditImage={editImage}
                    onShowLinkedPointOfImage={highlightPointOfImage}
                    onNewImageAdded={addNewImage}
                    points={points}
                />
                <Dialog open={!!warning} onClose={closeWarningDialog}>
                    <DialogTitle>{warning?.title}</DialogTitle>
                    <DialogContent>{warning?.text}</DialogContent>
                    <DialogActions>
                        <Button onClick={closeWarningDialog}>{warning?.acknowledgeLabel}</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={!!confirmation} onClose={closeConfirmation}>
                    <DialogTitle>{confirmation?.title}</DialogTitle>
                    <DialogContent>{confirmation?.text}</DialogContent>
                    <DialogActions>
                        <Button onClick={confirmation?.applyFunction} color={'warning'}>
                            {confirmation?.applyLabel}
                        </Button>
                        <Button onClick={closeConfirmation}>{confirmation?.cancelLabel}</Button>
                    </DialogActions>
                </Dialog>
                <DashboardImageEditor image={editedImage} saveImage={saveEditedImage} />
            </div>
        </SpgPage>
    );
}
