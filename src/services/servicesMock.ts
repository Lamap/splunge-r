import { LatLngLiteral } from 'leaflet';
import { ISpgPointWithStates } from '../interfaces/ISpgPointWithStates';
import { ApiRoutes, IPointCreateRequestBody, IPointCreateResponse, IPointFetchResponse, ISpgImage, ISpgPoint } from 'splunge-common-lib';
import axios, { AxiosResponse } from 'axios';
import { createApiUrl } from './createApiUrl';

export interface IDeleteImageResponse {
    readonly images: ISpgImage[];
    readonly points: ISpgPoint[];
}
export async function requestImagesFetch(): Promise<ISpgImage[]> {
    try {
        const imagesResponse: AxiosResponse<ISpgImage[]> = await axios.get<ISpgImage[]>(createApiUrl(ApiRoutes.SPG_IMAGES_FETCH));
        return imagesResponse.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
export async function requestPointsFetch(): Promise<IPointFetchResponse> {
    try {
        const allPointsResponse: AxiosResponse<IPointFetchResponse> = await axios.get<IPointFetchResponse>(createApiUrl(ApiRoutes.SPG_POINTS_FETCH));
        return allPointsResponse.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function requestCreatePointForImage(position: LatLngLiteral, imageId: string): Promise<IPointCreateResponse> {
    try {
        const createdPointResponse: AxiosResponse<ISpgPoint[]> = await axios.post<
            IPointCreateResponse,
            AxiosResponse<IPointCreateResponse>,
            IPointCreateRequestBody
        >(createApiUrl(ApiRoutes.SPG_POINT_CREATE), {
            point: {
                position,
            },
            imageId,
        });
        return createdPointResponse.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
export function addImageToPointCall(pointId: string, newImageId: string, points: ISpgPoint[]): ISpgPoint[] {
    const updatedPoints: ISpgPoint[] = points.map((point: ISpgPoint) => {
        if (point.id === pointId) {
            return {
                ...point,
                images: [...point.images, ...(!point.images.includes(newImageId) ? [newImageId] : [])],
            };
        }
        return {
            ...point,
            images: point.images.filter(imageId => imageId !== newImageId),
        };
    });
    return updatedPoints;
}
export async function updatePointCall(point: ISpgPoint): Promise<ISpgPoint> {
    return await point;
}
export async function deletePointCall(pointToDeleteId: string, points: ISpgPoint[], images: ISpgImage[]): Promise<ISpgPoint[]> {
    const pointToDelete: ISpgPointWithStates | undefined = points.find(point => point.id === pointToDeleteId);
    if (!!pointToDelete?.images.length) {
        throw Error('This point has images attached, remove them before you delete');
    }
    return points.filter(point => point.id !== pointToDeleteId);
}

export async function detachImageFromPointCall(imageIdToRemove: string, points: ISpgPoint[]): Promise<ISpgPoint[]> {
    const updatedPoints: ISpgPointWithStates[] = points.map(point => {
        return {
            ...point,
            images: point.images.filter((imageId: string) => imageId !== imageIdToRemove),
        };
    });
    return updatedPoints;
}
export async function createNewImageCall(file: File): Promise<ISpgImage> {
    try {
        const formData: FormData = new FormData();
        formData.append('image', file);
        const newImageResponse: AxiosResponse<ISpgImage> = await axios.post(createApiUrl(ApiRoutes.SPG_IMAGE_CREATE), formData);
        return newImageResponse.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
export async function deleteImageCall(imageToDelete: string, images: ISpgImage[], points: ISpgPoint[]): Promise<IDeleteImageResponse> {
    const newImageList: ISpgImage[] = images.filter(image => image.id !== imageToDelete);
    const updatedPoints: ISpgPoint[] = points.map(point => {
        return {
            ...point,
            images: point.images.filter(imageId => imageId !== imageToDelete),
        };
    });
    return { images: newImageList, points: updatedPoints };
}
