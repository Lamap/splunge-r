import './SpgImageList.scss';
import React from 'react';
import { ISpgImageWithStates } from '../../interfaces/ISpgImageWithStates';
import LaunchIcon from '@mui/icons-material/Launch';

interface IProps {
    readonly colCount?: number;
    readonly className?: string;
    readonly images: ISpgImageWithStates[];
    readonly points: ISpgPoint[];
    readonly onTargetPointOfImage?: (imageId: string) => void;
    readonly onLaunchImage?: (imageId: string) => void;
}
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import { ISpgPoint } from 'splunge-common-lib';

export const SpgImageList: React.FC<IProps> = ({
    colCount = 3,
    className,
    images,
    onTargetPointOfImage,
    onLaunchImage,
    points,
}): React.ReactElement => {
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
        return Math.min((item.widthPerHeightRatio / accumulatedWidthRate) * 100, 50);
    }

    function targetPointOfImage(imageId: string): void {
        console.log('target', imageId);
        !!onTargetPointOfImage && onTargetPointOfImage(imageId);
    }
    function launchImage(imageId: string): void {
        console.log('launch', imageId);
        !!onLaunchImage && onLaunchImage(imageId);
    }
    function getPointOfImage(imageId: string): ISpgPoint | undefined {
        return points.find(({ images }): boolean => images.includes(imageId));
    }
    return (
        <div className={classNamesArray.join(' ')}>
            {imageRows.map((row, index) => (
                <div key={index} className={'spg-image-list__row'}>
                    {row.map(image => (
                        <div key={image.id} className={'spg-image-list__row-item'} style={{ width: `${getWidthPercent(row, image)}%` }}>
                            <div className={'spg-image-list__row-item-img'} style={{ backgroundImage: `url(${image.url})` }}></div>
                            {!!getPointOfImage(image.id) && (
                                <LocationSearchingIcon
                                    color={'primary'}
                                    className={'spg-image-list__row-item-locate-btn'}
                                    onClick={(): void => targetPointOfImage(image.id)}
                                />
                            )}
                            <LaunchIcon
                                color={'primary'}
                                className={'spg-image-list__row-item-launch-btn'}
                                onClick={(): void => launchImage(image.id)}
                            />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
