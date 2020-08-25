import { StandarisedLayout } from "../../../src/layoutAlgorithms/types";

function getAngle([cx, cy], [ex, ey]) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    return theta;
  }

export function medianEdgeBreaksMetric(layout: StandarisedLayout): number {
    const breaks = layout.edges
        .filter(e => e.start_id !== e.end_id)
        .map(edge => edge.points.slice(1, -1))
        .map(points => {
            let lastAngle = -Infinity;
            return points.slice(1).filter((point, idx) => {
                const angle = getAngle(points[idx], point)
                const isChanged = Math.abs(angle - lastAngle) > 1
                lastAngle = angle;
                return isChanged;
            }).length
        });

    return breaks.reduce((sum, x) => sum + x, 0) / breaks.length;
}