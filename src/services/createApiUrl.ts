import { ApiRoutes } from 'splunge-common-lib';

export function createApiUrl(route: ApiRoutes): string {
    return `${process.env.REACT_APP_API_URL}${route}`;
}
export function createApiUrlWithIdParam(route: ApiRoutes, id: string): string {
    const replacedRoute: string = route.replace(`:id`, id);
    return `${process.env.REACT_APP_API_URL}/${replacedRoute}`;
}
