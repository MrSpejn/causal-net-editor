import { Point } from '../graphVisualization/types';

class VizEdge {
    points: Array<Point>;
    start: string;
    end: string;

    constructor(start: string, end: string, points: Array<Point>) {
        this.points = points;
        this.start = start;
        this.end = end;
    }
}

export default VizEdge;