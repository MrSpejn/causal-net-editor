import { StandarisedLayout, StandarisedLayoutEdge } from "../../../src/layoutAlgorithms/types";
import { Point } from "../../../src/graphVisualization/types";
import { intersect } from 'mathjs';

type Segment = {
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
    p1: Point,
    p2: Point,
}
type BoundedEdge = {
    minX: number,
    minY: number,
    maxX: number,
    maxY: number,
    segments: Array<Segment>
}

let log = false;
function wrapEdgeBoundry(edge: StandarisedLayoutEdge): BoundedEdge {
    return {
        minX: Math.min(...edge.points.map(p => p[0])),
        maxX: Math.max(...edge.points.map(p => p[0])),
        minY: Math.min(...edge.points.map(p => p[1])),
        maxY: Math.max(...edge.points.map(p => p[1])),
        segments: edge.points.slice(1).map((point, idx) => ({
            minX: Math.min(point[0], edge.points[idx][0]),
            maxX: Math.max(point[0], edge.points[idx][0]),
            minY: Math.min(point[1], edge.points[idx][1]),
            maxY: Math.max(point[1], edge.points[idx][1]),
            p1: point,
            p2: edge.points[idx],
        })),
    }
}

function doBoundriesIntersect(edge1: BoundedEdge, edge2: BoundedEdge): boolean {
    if (edge1.maxX <= edge2.minX) return false;
    if (edge1.maxY <= edge2.minY) return false;
    if (edge2.maxX <= edge1.minX) return false;
    if (edge2.maxY <= edge1.minY) return false;
    return true;
}

function doEdgeBountryAndSegmentIntersect(edge: BoundedEdge, segment: Segment): boolean {
    if (edge.maxX <= segment.minX) return false;
    if (edge.maxY <= segment.minY) return false;
    if (segment.maxX <= edge.minX) return false;
    if (segment.maxY <= edge.minY) return false;
    return true;
}

function doSegmentsBoundriesIntersect(segment1: Segment, segment2: Segment): boolean {
    if (segment1.maxX <= segment2.minX) return false;
    if (segment1.maxY <= segment2.minY) return false;
    if (segment2.maxX <= segment1.minX) return false;
    if (segment2.maxY <= segment1.minY) return false;
    return true;
}

function checkIfLinesCross(edge1: BoundedEdge, edge2: BoundedEdge): boolean {
    if (log) console.log(doBoundriesIntersect(edge1, edge2))
    if (!doBoundriesIntersect(edge1, edge2)) return false;
    const segs1 = edge1.segments.filter(seg => doEdgeBountryAndSegmentIntersect(edge2, seg))
    const segs2 = edge2.segments.filter(seg => doEdgeBountryAndSegmentIntersect(edge1, seg))
    if (log) console.log(segs1.length, segs2.length)

    for (let seg1 of segs1) {
        for (let seg2 of segs2) {
            if (!doSegmentsBoundriesIntersect(seg1, seg2)) continue;
            const intersectionPoint = intersect(seg1.p1, seg1.p2, seg2.p1, seg2.p2);
            if (intersectionPoint == null) continue;
            if (intersectionPoint[0] > Math.max(seg1.minX, seg2.minX) &&
                intersectionPoint[0] < Math.min(seg1.maxX, seg2.maxX)) {
                return true;
            }
        }
    }

    return false;
}

export function nCrossingEdgesMetric(layout: StandarisedLayout): number {

    return layout.edges.map((edge1, idx1) => layout.edges.slice(idx1 + 1).filter(edge2 => {
        if (edge1.start_id == "2" && edge1.end_id == "5" && edge2.start_id == "4" && edge2.end_id == "1") {
            log = true;
            console.log("Debug");
        }
        const doCross = checkIfLinesCross(wrapEdgeBoundry(edge1), wrapEdgeBoundry(edge2));
        if (edge1.start_id == "2" && edge1.end_id == "5" && edge2.start_id == "4" && edge2.end_id == "1") {
            log = false;
        }
        return doCross;
    }).length).reduce((sum, v) => sum + v, 0);
}