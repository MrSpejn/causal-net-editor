import _ from 'lodash';
import { Node, AdjacencyMatrix } from './types';

export const OUTGOING = 'outgoing';
export const INCOMMING = 'incomming';

class Graph {
    nodes: Array<Node>;
    adj_matrix: AdjacencyMatrix;

    constructor(nodes: Array<Node>) {
        this.nodes = nodes;
        this.adj_matrix = this._compute_adjmatrix(nodes);
    }

    _compute_adjmatrix(nodes: Array<Node>): AdjacencyMatrix  {
        return this.nodes.map(row => this.nodes.map(col => {
            return (
                _.flatten(row[OUTGOING]).includes(col.id) ||
                _.flatten(col[INCOMMING]).includes(row.id)
            ) as unknown as number + 0
        }))
    }

    static fromJSON(json_string: string): Graph {
        return new Graph(JSON.parse(json_string).nodes)
    }
}

export default Graph