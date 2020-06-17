import _ from 'lodash';

export const OUTGOING = 'outgoing';
export const INCOMMING = 'incomming';

class Graph {
    constructor(nodes) {
        this.nodes = nodes;
        this.adj_matrix = this._compute_adjmatrix(nodes);
    }

    _compute_adjmatrix(nodes) {
        return this.nodes.map(row => this.nodes.map(col => {
            return _.flatten(row[OUTGOING]).includes(col.id) || _.flatten(col[INCOMMING]).includes(row.id)
        }))
    }

    static fromJSON(json_string) {
        return new Graph(JSON.parse(json_string).nodes)
    }
}

export default Graph