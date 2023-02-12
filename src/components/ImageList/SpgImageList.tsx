import './SpgImageList.scss';
import React, { RefObject, useEffect, useRef } from 'react';
import { ISpgImageWithStates } from '../../interfaces/ISpgImageWithStates';
import LaunchIcon from '@mui/icons-material/Launch';

interface IProps {
    readonly colCount?: number;
    readonly className?: string;
    readonly images: ISpgImageWithStates[];
    readonly points: ISpgPoint[];
    readonly onTargetPointOfImage?: (imageId: string, xOffset: number, yOffset: number) => void;
    readonly onLaunchImage?: (imageId: string) => void;
}
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import { ISpgPoint } from 'splunge-common-lib';
import { ISpgPointWithStates } from '../../interfaces/ISpgPointWithStates';

export const SpgImageList: React.FC<IProps> = ({
    colCount = 3,
    className,
    images,
    onTargetPointOfImage,
    onLaunchImage,
    points,
}: IProps): React.ReactElement => {
    const classNamesArray: string[] = ['spg-image-list', ...(!!className ? [className] : [])];
    const listRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    // const [highlightedImages, setHighlightedImages] = useState<ISpgImageWithStates[]>([]);
    const imageRows: ISpgImageWithStates[][] = images
        .sort(sortImagesByHiglight)
        .reduce((acc: ISpgImageWithStates[][], value: ISpgImageWithStates, index: number): ISpgImageWithStates[][] => {
            if (index % colCount === 0) {
                acc.push([value]);
            } else {
                acc[acc.length - 1].push(value);
            }
            return acc;
        }, []);

    useEffect((): void => {
        if (listRef.current) {
            listRef.current.scrollTop = 0;
        }
    }, [images]);
    function sortImagesByHiglight(imageA: ISpgImageWithStates, imageB: ISpgImageWithStates): number {
        return imageA.isHighlighted && !imageB.isHighlighted ? -1 : 0;
    }
    function getWidthPercent(rowItems: ISpgImageWithStates[], item: ISpgImageWithStates): number {
        const accumulatedWidthRate: number = rowItems.reduce((acc: number, image: ISpgImageWithStates): number => {
            return acc + image.widthPerHeightRatio;
        }, 0);
        return Math.min((item.widthPerHeightRatio / accumulatedWidthRate) * 100, 50);
    }

    function targetPointOfImage(imageId: string, rowIndex: number, colIndex: number): void {
        let xPosition: number = 0;
        for (let col: number = 0; col < colIndex; col++) {
            xPosition += getWidthPercent(imageRows[rowIndex], imageRows[rowIndex][col]);
        }
        !!onTargetPointOfImage && onTargetPointOfImage(imageId, (xPosition / 100) * 520, rowIndex * 150 + 75);
    }
    function launchImage(imageId: string): void {
        console.log('launch', imageId);
        !!onLaunchImage && onLaunchImage(imageId);
    }
    function getPointOfImage(imageId: string): ISpgPoint | undefined {
        return points.find(({ images }: ISpgPointWithStates): boolean => images.includes(imageId));
    }
    function getItemClassNames(image: ISpgImageWithStates): string {
        const imageClassArray: string[] = [
            'spg-image-list__row-item',
            ...(image.isHighlighted ? ['spg-image-list__row-item--highlighted'] : []),
            ...(image.isSelected ? ['spg-image-list__row-item--selected'] : []),
        ];
        return imageClassArray.join(' ');
    }
    return (
        <div className={classNamesArray.join(' ')} ref={listRef}>
            {imageRows.map((row: ISpgImageWithStates[], rowIndex: number) => (
                <div key={rowIndex} className={'spg-image-list__row'}>
                    {row.map((image: ISpgImageWithStates, colIndex: number) => (
                        <div key={image.id} className={getItemClassNames(image)} style={{ width: `${getWidthPercent(row, image)}%` }}>
                            <div className={'spg-image-list__row-item-img'} style={{ backgroundImage: `url(${image.url})` }}></div>
                            <div className="spg-image-list__img-actions">
                                {!!getPointOfImage(image.id) && (
                                    <LocationSearchingIcon
                                        color={'primary'}
                                        className={'spg-image-list__row-item-locate-btn'}
                                        onClick={(): void => targetPointOfImage(image.id, rowIndex, colIndex)}
                                    />
                                )}
                                <LaunchIcon
                                    color={'primary'}
                                    className={'spg-image-list__row-item-launch-btn'}
                                    onClick={(): void => launchImage(image.id)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
