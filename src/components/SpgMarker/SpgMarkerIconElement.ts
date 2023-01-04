import eyeIcon from '../../assets/icons/eye-icon.svg';
import panorama from '../../assets/icons/panorama.svg';
export interface ISpgMarkerElementProps {
    readonly rotation: number;
    readonly isHighlighted?: boolean;
    readonly isPointAddingMode?: boolean;
    readonly isSelected?: boolean;
    readonly hasDirection?: boolean;
    readonly connectedImageCount?: number;
}
export const SpgMarkerIconElement: (props: ISpgMarkerElementProps) => string = ({
    rotation = 0,
    isHighlighted = false,
    isSelected = false,
    isPointAddingMode = false,
    hasDirection = false,
    connectedImageCount = 0,
}): string => {
    const panoramaDiv: string = `<div class="spg-marker-icon__panorama" style="background-image: url(${panorama}); transform: rotate(${rotation}deg)"></div>`;
    const connectedImageCountSpan: string = `<span class="spg-marker-icon__count">${connectedImageCount}</span>`;
    const markerIconClassNames: string[] = [
        'spg-marker-icon',
        ...(isHighlighted ? ['spg-marker-icon--highlighted'] : []),
        ...(isPointAddingMode ? ['spg-marker-icon--point-adding-mode'] : []),
        ...(isSelected ? ['spg-marker-icon--selected'] : []),
    ];
    return `
        <div class="${markerIconClassNames.join(' ')}" >    
            ${hasDirection ? panoramaDiv : ''}
            <div class="spg-marker-icon__eye" style="background-image: url(${eyeIcon});"></div>
            ${!!connectedImageCount ? connectedImageCountSpan : ''}
        </div>`;
};
