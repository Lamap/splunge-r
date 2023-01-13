import './MapOverlayController.scss';
import React, { SyntheticEvent } from 'react';
import IMapOverlay from '../../interfaces/IMapOverlay';
import { Slider } from '@mui/material';

interface IProps {
    readonly className?: string;
    readonly onOpacityChanged?: (mapOverlayId: string, opacity: number) => void;
    readonly overlays: IMapOverlay[];
}
export const MapOverlayController: React.FC<IProps> = ({ className, onOpacityChanged, overlays }: IProps) => {
    const baseClassname: string = 'spg-map-overlay-controller';
    const classnameArray: string[] = [baseClassname, ...(!!className ? [className] : [])];
    function opacityChanged(id: string, value: number): void {
        console.log(value);
        !!onOpacityChanged && onOpacityChanged(id, value);
    }
    return (
        <div className={classnameArray.join(' ')}>
            <span className={`${baseClassname}__main-label`}>Maps of the past</span>
            <div className={`${baseClassname}__items`}>
                {overlays.map(
                    (overlay: IMapOverlay): React.ReactElement => (
                        <div key={overlay.id} className={`${baseClassname}__item`}>
                            <div className={`${baseClassname}__date-and-opacity`}>
                                <span className={`${baseClassname}__date-label`}>
                                    <span className={`${baseClassname}__date-label-child`}>{overlay.dateRange.end}</span>
                                    <span
                                        className={`${baseClassname}__date-label-child ${baseClassname}__date-label-colored`}
                                        style={{ opacity: `${overlay.opacity}` }}
                                    >
                                        {overlay.dateRange.end}
                                    </span>
                                </span>
                                <span className={`${baseClassname}__opacity-slider`}>
                                    <Slider
                                        size={'small'}
                                        min={0}
                                        max={1}
                                        defaultValue={overlay.opacity}
                                        onChange={(event: Event | SyntheticEvent<Element, Event>, value: number | number[]): void =>
                                            opacityChanged(overlay.id, value as number)
                                        }
                                        step={0.01}
                                    />
                                </span>
                            </div>
                            <span className={`${baseClassname}__name-label`}>{overlay.name}</span>
                        </div>
                    ),
                )}
            </div>
        </div>
    );
};
