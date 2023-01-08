import { LatLngLiteral } from 'leaflet';
import { ISpgPointWithStates } from '../interfaces/ISpgPointWithStates';
import { ISpgImage, ISpgPoint } from 'splunge-common-lib/src';
import axios, { AxiosResponse } from 'axios';

export interface IDeleteImageResponse {
    readonly images: ISpgImage[];
    readonly points: ISpgPoint[];
}

export interface ICreatePointForImageRequest {
    imageId: string;
    point: Omit<ISpgPoint, 'id' | 'images'>;
}
export async function createPointForImageCall(position: LatLngLiteral, imageId: string): Promise<ISpgPoint[]> {
    try {
        const createdPointResponse: AxiosResponse<ISpgPoint[]> = await axios.post<
            ISpgPoint[],
            AxiosResponse<ISpgPoint[]>,
            ICreatePointForImageRequest
        >('http://localhost:2222/pointaaaa', {
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
export async function createNewImageCall(file: string): Promise<ISpgImage> {
    const newImage: ISpgImage = {
        id: new Date().getTime().toString(),
        url: file,
        date: { on: new Date() },
    };
    return newImage;
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
