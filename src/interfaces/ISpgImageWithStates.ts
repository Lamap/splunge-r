import { ISpgImage } from 'splunge-common-lib/src';

export interface ISpgImageWithStates extends ISpgImage {
    readonly isHighlighted?: boolean;
}
