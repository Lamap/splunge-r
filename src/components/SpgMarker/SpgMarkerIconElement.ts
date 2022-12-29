import eyeIcon from '../../assets/icons/eye-icon.svg';
import panorama from '../../assets/icons/panorama.svg';

export const SpgMarkerIconElement = (rotation: number = 0, isHighlighted: boolean): string => {
    console.log(isHighlighted);
    return `
        <div class="spg-marker-icon ${isHighlighted ? 'spg-marker-icon--highlighted' : ''}" >    
            <div class="spg-marker-icon__panorama" style="background-image: url(${panorama}); transform: rotate(${rotation}deg)"></div>
            <div class="spg-marker-icon__eye" style="background-image: url(${eyeIcon});"></div>
        </div>`;
};
