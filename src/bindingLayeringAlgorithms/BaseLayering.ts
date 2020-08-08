import { Anchor, AnchorIdx, Connection } from "../graphVisualization/types";

class BaseLayering {
    translateToAnchorIndexConnections(anchors: Array<Anchor>, connections: Array<Connection>): Array<Array<number>> {
        const lookup: { [key: string]: AnchorIdx; } = {};

        Object.values(anchors).forEach((anchor, idx) => {
            lookup[`${anchor.in ? 'in' : 'out'}${anchor.target}`] = idx;
        })

        const connAsAnchorIdx = connections.map(conn => conn.nodes.map(node_id => {
            const anchor_idx = lookup[`${conn.in ? 'in' : 'out'}${node_id}`];
            if (anchor_idx === undefined) {
                throw new Error(`Could not find a proper anchor for a binding: ${`${conn.in ? 'in' : 'out'}${node_id}`}`);
            }
            return anchor_idx;
        }))

        return connAsAnchorIdx
    }
}

export default BaseLayering