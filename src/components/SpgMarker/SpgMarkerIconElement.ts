import panorama from '../../assets/icons/panorama.svg';
export interface ISpgMarkerElementProps {
    readonly rotation: number;
    readonly showCountOnlyOnHover?: boolean;
    readonly isHighlighted?: boolean;
    readonly isPointAddingMode?: boolean;
    readonly isSelected?: boolean;
    readonly hasDirection?: boolean;
    readonly connectedImageCount?: number;
}
export const SpgMarkerIconElement: (props: ISpgMarkerElementProps) => string = ({
    rotation = 0,
    showCountOnlyOnHover,
    isHighlighted = false,
    isSelected = false,
    isPointAddingMode = false,
    hasDirection = false,
    connectedImageCount = 0,
}: ISpgMarkerElementProps): string => {
    const panoramaDiv: string = `<div class="spg-marker-icon__panorama" style="background-image: url(${panorama}); transform: rotate(${
        rotation - 90
    }deg)"></div>`;
    const connectedImageCountSpan: string = `<span class="spg-marker-icon__count">${connectedImageCount}</span>`;
    const markerIconClassNames: string[] = [
        'spg-marker-icon',
        ...(isHighlighted ? ['spg-marker-icon--highlighted'] : []),
        ...(isPointAddingMode ? ['spg-marker-icon--point-adding-mode'] : []),
        ...(isSelected ? ['spg-marker-icon--selected'] : []),
        ...(showCountOnlyOnHover ? ['spg-marker-icon--count-on-hover'] : []),
    ];
    return `
        <div class="${markerIconClassNames.join(' ')}" >    
            ${hasDirection ? panoramaDiv : ''}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" class="spg-marker-icon__eye">
                <g transform="translate(0,0)">
                    <path stroke="null" fill="white" stroke-width="0" id="svg_3" d="m23.760479,11.538067s-4.167131,8.692361 -11.745788,8.692361c-7.036686,0 -11.77517,-8.692361 -11.77517,-8.692361s4.357252,-7.768494 11.77517,-7.768494c7.540434,0 11.745788,7.768494 11.745788,7.768494z"/>
                    <path stroke="null" fill="deepskyblue" stroke-width="0" id="eye-fill-part" d="m21.78443,11.63776s-3.46695,6.81649 -9.7722,6.81649c-5.85435,0 -9.79666,-6.81649 -9.79666,-6.81649s3.62513,-6.09201 9.79666,-6.09201c6.27345,0 9.7722,6.09201 9.7722,6.09201z"/>
                    <ellipse stroke="null" ry="4.554624" rx="4.554624" id="svg_5" cy="12" cx="12" stroke-opacity="null" stroke-width="0" fill="white"/>
                    <ellipse ry="2.533331" rx="2.533331" id="svg_7" cy="12" cx="12" stroke-opacity="null" stroke-width="0" stroke="null" fill="black"/>
                </g>
            </svg>
            ${!!connectedImageCount ? connectedImageCountSpan : ''}
        </div>`;
};
