import './PointImageConnection.scss';
import React from 'react';
import { IXYPoint } from '../../interfaces/IXYPoint';

interface IProps {
    readonly start: IXYPoint;
    readonly end: IXYPoint;
    readonly targetToPoint?: boolean;
}
export const PointImageConnection: React.FC<IProps> = ({ start, end, targetToPoint }: IProps): React.ReactElement => {
    const lineLength: number = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    const rotation: number = (Math.atan((end.x - start.x) / Math.abs(end.y - start.y)) / Math.PI) * 180;
    const rotationInDeg: number = end.y - start.y < 0 ? 90 - rotation : rotation + 270;
    const classNamesArray: string[] = ['spg-point-image-connection', ...(targetToPoint ? ['spg-point-image-connection--target-to-point'] : [])];
    return (
        <div
            className={classNamesArray.join(' ')}
            style={{
                width: `${lineLength}px`,
                top: `${start.y}px`,
                left: `${start.x}px`,
                transform: `rotate(${-rotationInDeg}deg)`,
            }}
        >
            <div className="spg-point-image-connection__line"></div>
        </div>
    );
};
