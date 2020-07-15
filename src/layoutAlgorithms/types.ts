import { Point } from '../graphVisualization/types';
import { AdjacencyMatrix } from '../graphRepresentation/types';

export interface GraphLayout {
    compute_positions(
        adj_matrix: AdjacencyMatrix, node_ids: Array<string>,
        width: number, height: number): Promise<StandarisedLayout>
}

export type StandarisedLayoutEdge = {
    start_id: string,
    end_id: string,
    points: Array<Point>,
}

export type StandarisedLayoutNode = {
    id: string,
    position: Point,
};

export type StandarisedLayout = {
    nodes: Array<StandarisedLayoutNode>;
    edges: Array<StandarisedLayoutEdge>;
}

export type BoundingBox = {
    x: number;
    y: number;
    width: number;
    height: number;
}