import { StandarisedLayout } from "../../../src/layoutAlgorithms/types";
import * as math from "mathjs";

export function meanNeighbourDistanceMetric(layout: StandarisedLayout): number {

    const nodeLookup = {}
    layout.nodes.forEach(node => {
        nodeLookup[node.id] = node;
    });
    const neighbourDistance = layout.edges
        .filter(e => e.start_id !== e.end_id)
        .map(edge => math.distance(
            nodeLookup[edge.start_id].position,
            nodeLookup[edge.end_id].position,
        ) as number - 4)

    return neighbourDistance.reduce((sum, x) => sum + x, 0) / neighbourDistance.length;
}