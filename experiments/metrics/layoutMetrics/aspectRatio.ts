import { StandarisedLayout } from "../../../src/layoutAlgorithms/types";

export function aspectRatioMetric(layout: StandarisedLayout, target: number): number {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (let edge of layout.edges) {
        for (let point of edge.points) {
            if (point[0] < minX) minX = point[0];
            if (point[0] > maxX) maxX = point[0];
            if (point[1] < minY) minY = point[1];
            if (point[1] > maxY) maxY = point[1];
        }
    }
    for (let node of layout.nodes) {
        if (node.position[0] < minX) minX = node.position[0];
        if (node.position[0] > maxX) maxX = node.position[0];
        if (node.position[1] < minY) minY = node.position[1];
        if (node.position[1] > maxY) maxY = node.position[1];
    }
    const width = maxX - minX;
    const height = maxY - minY;

    const proportion = target * height / width;
    return proportion > 1 ? 1 / proportion : proportion;
}