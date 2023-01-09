import { ISpgPoint } from 'splunge-common-lib';

export interface ISpgPointWithStates extends ISpgPoint {
    readonly isSelected?: boolean;
    readonly isHighlighted?: boolean;
}
