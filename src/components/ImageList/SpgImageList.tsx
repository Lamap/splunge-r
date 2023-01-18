import './SpgImageList.scss';
import React from 'react';
import { ISpgImageWithStates } from '../../interfaces/ISpgImageWithStates';
interface IProps {
    readonly colCount?: number;
    readonly className?: string;
    readonly images: ISpgImageWithStates[];
}

export const SpgImageList: React.FC<IProps> = ({ colCount = 3, className, images }): React.ReactElement => {
    const classNamesArray: string[] = ['spg-imagelist', ...(!!className ? [className] : [])];
    const imageRows: ISpgImageWithStates[][] = images.reduce(
        (acc: ISpgImageWithStates[][], value: ISpgImageWithStates, index: number): ISpgImageWithStates[][] => {
            if (index % colCount === 0) {
                acc.push([value]);
            } else {
                acc[acc.length - 1].push(value);
            }
            return acc;
        },
        [],
    );
    console.log(imageRows);
    function getWidthPercent(rowItems: ISpgImageWithStates[], item: ISpgImageWithStates): number {
        const accumulatedWidthRate: number = rowItems.reduce((acc, image): number => {
            return acc + image.widthPerHeightRatio;
        }, 0);
        return (item.widthPerHeightRatio / accumulatedWidthRate) * 100;
    }
    return (
        <div className={classNamesArray.join(' ')}>
            {imageRows.map((row, index) => (
                <div key={index} className={'spg-image-list__row'}>
                    {row.map(image => (
                        <div key={image.id} className={'spg-image-list__row-item'} style={{ width: `${getWidthPercent(row, image)}%` }}>
                            <img className={'spg-image-list__row-item-img'} src={image.url} alt={image.url} />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
