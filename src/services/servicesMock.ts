import { LatLngLiteral } from 'leaflet';
import {
    ApiRoutes,
    IImageDeleteResponse,
    IImageUpdateRequestBody,
    IImageUpdateResponse,
    IPointAttachResponse,
    IPointCreateRequestBody,
    IPointCreateResponse,
    IPointDeleteResponse,
    IPointDetachResponse,
    IPointFetchResponse,
    IPointUpdateResponse,
    ISpgImage,
    ISpgPoint,
} from 'splunge-common-lib';
import axios, { AxiosResponse } from 'axios';
import { createApiUrl, createApiUrlWithIdParam, createApiUrlWithParams } from './createApiUrl';

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

export async function requestAttachImageToPoint(pointId: string, imageId: string): Promise<IPointAttachResponse> {
    try {
        const attachResponse: AxiosResponse<IPointAttachResponse> = await axios.put<IPointAttachResponse>(
            createApiUrlWithParams(ApiRoutes.SPG_ATTACH_IMAGE_TO_POINT, {
                pointId,
                imageId,
            }),
        );
        return attachResponse.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
export async function requestUpdatePoint(point: ISpgPoint): Promise<IPointUpdateResponse> {
    try {
        const updatePointResult: AxiosResponse<IPointUpdateResponse> = await axios.put<IPointUpdateResponse>(
            createApiUrlWithIdParam(ApiRoutes.SPG_POINT_UPDATE_AND_DELETE, point.id),
            point,
        );
        return updatePointResult.data;
    } catch (err) {
        console.log(err);
    }
    return await point;
}
export async function requestDeletePoint(pointToDeleteId: string): Promise<IPointDeleteResponse> {
    try {
        const deletePointResponse: AxiosResponse<IPointDeleteResponse> = await axios.delete(
            createApiUrlWithIdParam(ApiRoutes.SPG_POINT_UPDATE_AND_DELETE, pointToDeleteId),
        );
        return deletePointResponse.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function requestDetachImageFromPoint(imageIdToRemove: string): Promise<IPointDetachResponse> {
    try {
        const updatedPointResponse: AxiosResponse<IPointDetachResponse> = await axios.delete<IPointDetachResponse>(
            createApiUrlWithIdParam(ApiRoutes.SPG_DETACH_POINT_FROM_IMAGE, imageIdToRemove),
        );
        return updatedPointResponse.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
export async function requestCreateNewImage(file: File): Promise<ISpgImage> {
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
export async function requestDeleteImage(imageToDelete: string): Promise<IImageDeleteResponse> {
    try {
        const deleteResponse: AxiosResponse<IImageDeleteResponse> = await axios.delete<IImageDeleteResponse>(
            createApiUrlWithIdParam(ApiRoutes.SPG_IMAGE_UPDATE_AND_DELETE, imageToDelete),
        );
        return deleteResponse.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function requestUpdateImage(updatedImage: ISpgImage): Promise<IImageUpdateResponse> {
    try {
        const updatedImageResponse: AxiosResponse<IImageUpdateResponse> = await axios.put<
            IImageUpdateResponse,
            AxiosResponse<IImageUpdateResponse>,
            IImageUpdateRequestBody
        >(createApiUrlWithIdParam(ApiRoutes.SPG_IMAGE_UPDATE_AND_DELETE, updatedImage.id), updatedImage);
        return updatedImageResponse.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
    return await updatedImage;
}
