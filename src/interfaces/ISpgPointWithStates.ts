import { ISpgPoint } from 'splunge-common-lib/src';

export interface ISpgPointWithStates extends ISpgPoint {
    readonly isSelected?: boolean;
    readonly isHighlighted?: boolean;
}
