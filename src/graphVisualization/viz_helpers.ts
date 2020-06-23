import { Point } from '../graphVisualization/types';

function getInterpolationWithDistance(x1: number, y1: number, x2: number, y2: number, distance: number): number | null {
    const A = (x2*x2) - (2*x1*x2) + (x1*x1) + (y1*y1) + (y2*y2) - (2*y1*y2)
    const B = 2*x1*x2 + 2*y1*y2 - (2*x1*x1) - (2*y1*y1);
    const C = y1*y1 + x1*x1 - distance*distance;

    const delta = B*B - 4*A*C;
    
    if (delta < 0) {
        return null;
    }
    const optima = [
        (-B + Math.sqrt(delta)) / (2*A),
        (-B - Math.sqrt(delta)) / (2*A),
    ]
    for (let i = 0; i < optima.length; i++) {
        if (optima[i] >= 0 && optima[i] <= 1) {
            return optima[i]
        }
    }
    return null;
}

function findPointSanityCheck(center: Point, line: Array<Point>, distance: number): void {
    const first_p = [...line[0]];
    const last_p = [...line[line.length - 1]];

    first_p[0] -= center[0];
    first_p[1] -= center[1];
    last_p[0] -= center[0];
    last_p[1] -= center[1];

    const dist_first_square = first_p[0] * first_p[0] + first_p[1] * first_p[1];
    const dist_last_square = last_p[0] * last_p[0] + last_p[1] * last_p[1];

    if (dist_first_square < distance*distance && dist_last_square < distance*distance) {
        throw new Error('No point will not be found (Point to far)');
    }

    if (dist_first_square > distance*distance && dist_last_square > distance*distance) {
        console.log(center, line, distance);
        throw new Error('No point will not be found  (Point to close)');
    }
}

export function findPointOnLine(center: Point, line: Array<Point>, distance: number): Point {
    findPointSanityCheck(center, line, distance);

    const center_coords = line.map(point => ([point[0] - center[0], point[1] - center[1]]));
    for (let i = 0; i < center_coords.length - 1; i++) {
        const theta = getInterpolationWithDistance(center_coords[i][0], center_coords[i][1], center_coords[i+1][0], center_coords[i+1][1], distance);
    
        if (theta != null) {
            const point = [
                center_coords[i+1][0]*theta + center_coords[i][0]*(1 - theta) + center[0],
                center_coords[i+1][1]*theta + center_coords[i][1]*(1 - theta) + center[1],
            ];
              
            return point as Point;
        }
       
    }

    throw new Error(`Point could not be found: ${center}, ${distance}, ${line}`);
}
