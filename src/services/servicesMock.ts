import { LatLngLiteral } from 'leaflet';
import {
    ApiRoutes,
    IGetPointsByBoundsRequestBody,
    IImageDeleteResponse,
    IImageUpdateRequestBody,
    IImageUpdateResponse,
    ILoginUserRequestBody,
    IPointAttachResponse,
    IPointCreateRequestBody,
    IPointCreateResponse,
    IPointDeleteResponse,
    IPointDetachResponse,
    IPointFetchResponse,
    IPointsByBoundsResponse,
    IPointUpdateResponse,
    ISpgImage,
    ISpgPoint,
    IUser,
    PointOfImageResponse,
} from 'splunge-common-lib';
import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { createApiUrl, createApiUrlWithIdParam, createApiUrlWithParams } from './createApiUrl';
import { ISpgLatLngBounds } from 'splunge-common-lib/lib/interfaces/ISpgLatLngBounds';
import { IUserBase } from 'splunge-common-lib/lib/interfaces/IUserBase';

const axiosInstance: AxiosInstance = axios.create();
axiosInstance.defaults.withCredentials = true;
axiosInstance.interceptors.response.use(
    (value: AxiosResponse) => {
        console.log('value', value);
        return value;
    },
    (error: AxiosError) => {
        console.log('errr: ', error);
        if (error.response?.status === 403) {
            window.location.replace('/403');
            localStorage.setItem('user', '  ');
        }
    },
);
export async function requestImagesFetch(): Promise<ISpgImage[]> {
    try {
        const imagesResponse: AxiosResponse<ISpgImage[]> = await axiosInstance.get<ISpgImage[]>(createApiUrl(ApiRoutes.SPG_IMAGES_FETCH), {});
        return imagesResponse.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
export async function requestPointsFetch(onlyLinked?: boolean): Promise<IPointFetchResponse> {
    try {
        const allPointsResponse: AxiosResponse<IPointFetchResponse> = await axiosInstance.get<IPointFetchResponse>(
            createApiUrl(ApiRoutes.SPG_POINTS_FETCH),
            {
                params: {
                    onlyLinked: !!onlyLinked,
                },
            },
        );
        return allPointsResponse.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function requestCreatePointForImage(position: LatLngLiteral, imageId: string): Promise<IPointCreateResponse> {
    try {
        const createdPointResponse: AxiosResponse<ISpgPoint[]> = await axiosInstance.post<
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
        const attachResponse: AxiosResponse<IPointAttachResponse> = await axiosInstance.put<IPointAttachResponse>(
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
        const updatePointResult: AxiosResponse<IPointUpdateResponse> = await axiosInstance.put<IPointUpdateResponse>(
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
        const deletePointResponse: AxiosResponse<IPointDeleteResponse> = await axiosInstance.delete(
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
        const updatedPointResponse: AxiosResponse<IPointDetachResponse> = await axiosInstance.delete<IPointDetachResponse>(
            createApiUrlWithIdParam(ApiRoutes.SPG_DETACH_POINT_FROM_IMAGE, imageIdToRemove),
        );
        return updatedPointResponse.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
export async function requestCreateNewImage(file: File, widthPerHeightRatio: number): Promise<ISpgImage> {
    try {
        const formData: FormData = new FormData();
        formData.append('widthPerHeightRatio', widthPerHeightRatio.toString());
        formData.append('image', file);
        const newImageResponse: AxiosResponse<ISpgImage> = await axiosInstance.post<ISpgImage, AxiosResponse<ISpgImage>>(
            createApiUrl(ApiRoutes.SPG_IMAGE_CREATE),
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            },
        );
        return newImageResponse.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
export async function requestDeleteImage(imageToDelete: string): Promise<IImageDeleteResponse> {
    try {
        const deleteResponse: AxiosResponse<IImageDeleteResponse> = await axiosInstance.delete<IImageDeleteResponse>(
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
        const updatedImageResponse: AxiosResponse<IImageUpdateResponse> = await axiosInstance.put<
            IImageUpdateResponse,
            AxiosResponse<IImageUpdateResponse>,
            IImageUpdateRequestBody
        >(createApiUrlWithIdParam(ApiRoutes.SPG_IMAGE_UPDATE_AND_DELETE, updatedImage.id), updatedImage);
        return updatedImageResponse.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function requestFetchImage(imageId: string): Promise<ISpgImage> {
    try {
        const imageFetchResponse: AxiosResponse<ISpgImage> = await axiosInstance.get(createApiUrlWithIdParam(ApiRoutes.SPG_IMAGE_FETCH, imageId));
        return imageFetchResponse.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}
export async function requestGetPointOfImage(imageId: string): Promise<PointOfImageResponse> {
    try {
        const pointOfImageResponse: AxiosResponse<PointOfImageResponse> = await axiosInstance.get(
            createApiUrlWithIdParam(ApiRoutes.SPG_POINT_OF_IMAGE, imageId),
        );
        return pointOfImageResponse.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function requestGetPointsByBounds(bounds: ISpgLatLngBounds): Promise<IPointsByBoundsResponse> {
    try {
        const pointsByBoundsResponse: AxiosResponse<IPointsByBoundsResponse> = await axiosInstance.post<
            IPointsByBoundsResponse,
            AxiosResponse<IPointsByBoundsResponse>,
            IGetPointsByBoundsRequestBody
        >(createApiUrl(ApiRoutes.SPG_POINTS_BY_BOUNDS), bounds);
        return pointsByBoundsResponse.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function requestLogin(email: string, password: string): Promise<IUserBase> {
    try {
        const loginResponse: AxiosResponse<IUserBase> = await axiosInstance.post<IUser, AxiosResponse<IUserBase>, ILoginUserRequestBody>(
            createApiUrl(ApiRoutes.SPG_LOG_USER_IN),
            {
                email,
                password,
            },
        );
        return loginResponse.data;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

export async function requestLogout(): Promise<void> {
    try {
        const logoutResponse: AxiosResponse = await axiosInstance.post(createApiUrl(ApiRoutes.SPG_LOG_USER_OUT));
        console.log(logoutResponse.data);
    } catch (err) {
        console.log(err);
        throw err;
    }
}
