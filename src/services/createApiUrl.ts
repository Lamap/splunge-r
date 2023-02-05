import { ApiRoutes } from 'splunge-common-lib';
console.log('process.env.REACT_APP_API_URL', process.env.REACT_APP_API_URL);
export function createApiUrl(route: ApiRoutes): string {
    return `${process.env.REACT_APP_API_URL}${route}`;
}
export function createApiUrlWithIdParam(route: ApiRoutes, id: string): string {
    const replacedRoute: string = route.replace(`:id`, id);
    return `${process.env.REACT_APP_API_URL}${replacedRoute}`;
}
interface IParamKeyValuePair {
    [key: string]: string;
}
export function createApiUrlWithParams(route: ApiRoutes, params: IParamKeyValuePair): string {
    const replacedRoute: string = Object.keys(params).reduce((reducedString: string, paramKey: string) => {
        return reducedString.replace(`:${paramKey}`, params[paramKey]);
    }, route);
    return `${process.env.REACT_APP_API_URL}${replacedRoute}`;
}
