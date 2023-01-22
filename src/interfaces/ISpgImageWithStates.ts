import { ISpgImage } from 'splunge-common-lib';

export interface ISpgImageWithStates extends ISpgImage {
    readonly isHighlighted?: boolean;
    readonly isSelected?: boolean;
}
