import './MapOverlayController.scss';
import React from 'react';
import IMapOverlay from '../../interfaces/IMapOverlay';

interface IProps {
    readonly overlays: IMapOverlay[];
    readonly className?: string;
}
export const MapOverlayController: React.FC<IProps> = ({ className, overlays }) => {
    const baseClassname: string = 'spg-map-overlay-controller';
    const classnameArray: string[] = [baseClassname, ...(!!className ? [className] : [])];
    return (
        <div className={classnameArray.join(' ')}>
            <span>Maps of the past</span>
            <div className={`${baseClassname}__items`}>
                {overlays.map(overlay => (
                    <div key={overlay.id} className={`${baseClassname}__item`}>
                        <div className={`${baseClassname}__date-and-opacity`}>
                            <span className={`${baseClassname}__date-label`}>{overlay.dateRange.end}</span>
                            <span className={`${baseClassname}__opacity-slider`}>opacity</span>
                        </div>
                        <span className={`${baseClassname}__name-label`}>{overlay.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
