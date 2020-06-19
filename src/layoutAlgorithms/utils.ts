import _ from 'lodash';
import { StandarisedLayout, BoundingBox } from "./types";
import { Point } from '../graphVisualization/types';

export function compute_bounding_box(output: StandarisedLayout, scale: number): BoundingBox {
    const nodes_positions = output.nodes.map(node => node.position);
    const edges_positions = _.flatten(output.edges.map(edge => edge.points));

    const points: Array<Point> = nodes_positions.concat(edges_positions);
    
    let min_x = Infinity, min_y = Infinity, max_x = -Infinity, max_y = -Infinity;
    points.forEach(([x, y]) => {
        if ((x * scale) < min_x) {
            min_x = x*scale;
        }
        if ((x * scale) > max_x) {
            max_x = x*scale;
        }
        if ((y * scale) < min_y) {
            min_y = y*scale;
        }
        if ((y * scale) > max_y) {
            max_y = y*scale;
        }
    });

    const width = max_x - min_x;
    const height = max_y - min_y;
    //Add safety margin
    min_x -= 0.2 * width;
    max_x += 0.2 * width;
    min_y -= 0.2 * height;
    max_y += 0.2 * height;

    return {
        x: min_x,
        y: min_y,
        width: max_x - min_x,
        height: max_y - min_y,
    }

}