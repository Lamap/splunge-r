import { IUser } from 'splunge-common-lib';

export function getUser(): IUser | null {
    try {
        const userFromLocalStorage: string | null = localStorage.getItem('user');
        if (!userFromLocalStorage) {
            return null;
        }
        return JSON.parse(userFromLocalStorage) as IUser;
    } catch (err) {
        return null;
    }
}
