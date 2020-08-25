import { StandarisedLayout } from "../../../src/layoutAlgorithms/types";
import * as math from "mathjs";

export function meanEdgeLengthMetric(layout: StandarisedLayout): number {
    const edgeLengths = layout.edges
        .filter(e => e.start_id !== e.end_id)
        .map(edge => {
            return edge.points.slice(1).reduce((sum, p1, idx) => 
                sum + (math.distance(p1, edge.points[idx]) as number), 0);
        });

    return edgeLengths.reduce((sum, x) => sum + x, 0) / edgeLengths.length;
}