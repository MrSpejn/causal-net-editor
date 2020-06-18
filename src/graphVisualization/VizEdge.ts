import { Point } from '../graphVisualization/types';

class VizEdge {
    points: Array<Point>;
    
    constructor(points: Array<Point>) {
        this.points = points;
    }
}

export default VizEdge;