import { Point } from '../graphVisualization/types';

class VizEdge {
    points: Array<Point>;
    start: string;
    end: string;
    percentiles: number[];
    percentileIncrements: number[];
    segmentVectors: number[][];

    constructor(start: string, end: string, points: Array<Point>) {
        this.points = points;
        this.start = start;
        this.end = end;
        this.percentiles = this._computePercentiles(points);
        this.percentileIncrements = this.percentiles.slice(1).map((p, i) => p - this.percentiles[i])
        this.segmentVectors = this.points.slice(1).map((p, i) => [p[0] - this.points[i][0], p[1] - this.points[i][1]])
    }
    
    _computePercentiles(points: Array<Point>): number[] {
        const upperbounds = points.slice(0).reduce((prev, curr, i) => {
            const dist = Math.abs(curr[0] - points[i][0] + curr[1] - points[i][1]);

            return [...prev, dist + prev[prev.length - 1]]
        }, [0]).slice(0);

        const totalEdgeLength = upperbounds[upperbounds.length - 1]

        return upperbounds.map(bound => bound / totalEdgeLength * 100);
    }

    getPointOnLine(percentile: number): Point {
        const segmentIdx = this.percentiles.findIndex(per => percentile <= per) - 1;
        if (segmentIdx === -1) {
            return this.points[this.points.length - 1]
        }
        const segmentPercent = (this.percentiles[segmentIdx] - percentile) / this.percentileIncrements[segmentIdx];
        const segmentVector = this.segmentVectors[segmentIdx];
        const segmentStart = this.points[segmentIdx];
        return [
            segmentStart[0] - segmentPercent*segmentVector[0],
            segmentStart[1] - segmentPercent*segmentVector[1],
        ]
    }
}

export default VizEdge;