import { DivIcon, MarkerCluster, Point } from 'leaflet';

export default function renderClusterIcon(cluster: MarkerCluster): DivIcon {
    return new DivIcon({
        className: 'spg-marker-cluster-icon',
        html: `<span class="spg-marker-cluster-icon__circle">${cluster.getChildCount()}</span>`,
        iconSize: new Point(30, 30, true),
    });
}
