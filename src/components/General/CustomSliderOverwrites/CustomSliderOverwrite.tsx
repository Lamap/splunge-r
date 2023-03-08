import './CustomSliderOverwrite.scss';
import React from 'react';

interface IProps {
    readonly postFix?: 'percent' | 'degree';
    readonly child: React.ReactElement;
}
export const CustomSliderOverwrite: React.FC<IProps> = ({ child, postFix }: IProps): React.ReactElement => {
    const classnamesArray: string[] = [
        'spg-slider-overwrites',
        ...(postFix === 'percent' ? ['spg-slider-overwrites--percent'] : []),
        ...(postFix === 'degree' ? ['spg-slider-overwrites--degree'] : []),
    ];
    return <div className={classnamesArray.join(' ')}>{child}</div>;
};
