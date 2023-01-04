import { IDateInformationExact, IDateInformationRange } from './IDateInformation';

export interface ISpgImage {
    readonly id: string;
    readonly url: string;
    readonly title?: string;
    readonly location?: string;
    readonly date?: IDateInformationExact | IDateInformationRange;
}
export interface ISpgImageWithStates extends ISpgImage {
    readonly isHighlighted?: boolean;
}
