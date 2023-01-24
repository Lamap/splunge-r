import IMapOverlay from '../interfaces/IMapOverlay';
import { mapOverlays } from '../components/MockOverlays';

export default function getOverlaysFromQuery(overlayIds: (string | null)[], overlayOpacities: (string | null)[]): IMapOverlay[] {
    if (overlayIds.length !== overlayOpacities.length) {
        console.warn('Failing to parse overlays query params, mismatching arrays.');
        return [];
    }
    return overlayIds.reduce((builtOverlay: IMapOverlay[], idFromQuery: string | null, currentIndex: number): IMapOverlay[] => {
        const fullOverlay: IMapOverlay | undefined = mapOverlays.find(({ id }: IMapOverlay) => id === idFromQuery);
        if (!fullOverlay || idFromQuery === null) {
            return builtOverlay;
        }
        return [
            ...builtOverlay,
            {
                ...fullOverlay,
                opacity: Number(overlayOpacities[currentIndex]),
            },
        ];
    }, []);
}
