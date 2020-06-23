import _ from 'lodash';
import { Node, AdjacencyMatrix, ConnectionInProgress } from './types';
import { Connection } from '../graphVisualization/types';

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

    removeNode(nodeId: number): Graph {
        const newNodes = this.nodes.filter(node => node.id !== nodeId);
        const withFilteredConn = newNodes.map(node => ({
            ...node,
            incomming: _.uniqWith(node.incomming.filter(
                conn => conn.length !== 1 || conn[0] !== nodeId
            ).map(
                conn => conn.filter(target => target !== nodeId)
            ), _.isEqual),
            outgoing: _.uniqWith(node.outgoing.filter(
                conn => conn.length !== 1 || conn[0] !== nodeId
            ).map(
                conn => conn.filter(target => target !== nodeId
            )), _.isEqual),
        }));

        return new Graph(withFilteredConn);
    }

    editBinding(nodeId: number, toRemove: number, connection: Connection): Graph {
        const fieldName = connection.in ? 'incomming' : 'outgoing';
        const withFilteredConn = this.nodes.map(node => node.id === nodeId ? ({
            ...node,
            [fieldName]: _.uniqWith(
                node[fieldName].map(conn => (
                    _.isEqual(conn, connection.nodes) ?
                    conn.filter(node => node !== toRemove) :
                    conn
                )),
                _.isEqual,
            ).filter(conn => conn.length),
        }) : node);

        return new Graph(withFilteredConn);
    }

    addConnection(connection: ConnectionInProgress): Graph {
        const fieldName = connection.in ? 'incomming' : 'outgoing';
        const withFilteredConn = this.nodes.map(node => node.id === connection.origin ? ({
            ...node,
            [fieldName]: _.uniqWith([
                    ...node[fieldName],
                    connection.destination
                ].map(conn => conn.sort() || conn),
                _.isEqual,
            ).filter(conn => conn.length),
        }) : node);
        
        return new Graph(withFilteredConn);
    }
}

export default Graph