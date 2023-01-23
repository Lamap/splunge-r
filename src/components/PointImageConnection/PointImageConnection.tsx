import './PointImageConnection.scss';
import React from 'react';
import { IXYPoint } from '../../interfaces/IXYPoint';

interface IProps {
    readonly start: IXYPoint;
    readonly end: IXYPoint;
    readonly pointToStart?: boolean;
}
export const PointImageConnection: React.FC<IProps> = ({ start, end, pointToStart }): React.ReactElement => {
    const lineLength: number = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    const rotation: number = 90 - (Math.atan((end.x - start.x) / Math.abs(end.y - start.y)) / Math.PI) * 180;
    console.log('R::::', rotation, start, end, end.x - start.x, Math.abs(end.y - start.y));
    const classNamesArray: string[] = ['spg-point-image-connection', ...(pointToStart ? ['spg-point-image-connection'] : [])];
    return (
        <div
            className={classNamesArray.join(' ')}
            style={{
                width: `${lineLength}px`,
                top: `${start.y}px`,
                left: `${start.x}px`,
                transform: `rotate(${-rotation}deg)`,
            }}
        >
            <div className="spg-point-image-connection__line"></div>
        </div>
    );
};
