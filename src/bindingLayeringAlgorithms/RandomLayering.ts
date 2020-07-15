import {
    BindingLayering,
    Binding,
} from '../bindingLayeringAlgorithms/types';
import {
    Anchor,
    Connection,
    AnchorIdx,
} from '../graphVisualization/types';

import {
    get_fitting_ordering,
    new_empty_layer,
} from '../bindingLayeringAlgorithms/utils';

class RandomLayering implements BindingLayering {

    computeBindings(anchors: Array<Anchor>, connections: Array<Connection>): Array<Binding> {
        const layers = [
            new_empty_layer(anchors.length),
        ];
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

        const sequescesWithLayerNumber: Array<Binding> = [];

        connAsAnchorIdx.forEach((anchorIdx, idx) => {
            if (connections[idx].in && layers.length === 1) {
                layers.push(new_empty_layer(anchors.length));
            }

            let last_layer = layers[layers.length - 1];
            let fitting_order = get_fitting_ordering(last_layer, anchorIdx, anchors)
            if (fitting_order === null) {
                layers.push(new_empty_layer(anchors.length))
                last_layer = layers[layers.length - 1];
                fitting_order = get_fitting_ordering(last_layer, anchorIdx, anchors)!
            }

            for (let i = 0; i < fitting_order[1].length; i++) {
                last_layer[fitting_order[1][i]] = 1;
            }

            sequescesWithLayerNumber.push({
                sequence: fitting_order[0],
                layer_n: layers.length - 1,
            });
            
        })
        return sequescesWithLayerNumber;
    }
}

export default RandomLayering;