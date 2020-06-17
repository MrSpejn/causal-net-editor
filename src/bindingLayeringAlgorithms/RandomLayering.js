import _ from 'lodash';

function clockwise_distance(curr, prev) {
    if (curr < 0 && prev >= 0) {
        curr += 2*Math.PI;
    }
    const diff = curr - prev;
    if (diff < 0) {
        return diff + 2*Math.PI;
    }
    return diff;
}

function new_empty_layer(n) {
    return _.range(n).map(() => 0);
}

function get_sequences(a) {
    const anchors = _.sortBy(a);
    const n = anchors.length;
    return _.range(n).map((i) => ([
        ...anchors.slice(n - i, n),
        ...anchors.slice(0, n - i)
    ]))
}

function get_all_anchor_orderings(anchor_indices, n) {
    const sparse_sequences = get_sequences(anchor_indices)
    const full_sequences = sparse_sequences.map(seq => {
        const full_sequence = _.range(n);
        const first = seq[0];
        const last = seq[seq.length - 1];
        const max = Math.max(...seq);
        if (last == max) {
            return full_sequence.slice(first, last + 1);
        }
        else {
            return [
                ...full_sequence.slice(0, last + 1),
                ...full_sequence.slice(first),
            ]
        }
    })
    return _.zip(sparse_sequences, full_sequences)
}

function does_ordering_fit(layer, ordering) {
    for (let i = 0; i < ordering.length; i++) {
        if (layer[ordering[i]] > 0) {
            return false;
        }
    }
    return true;
}

function get_fitting_ordering(layer, anchor_indices, anchors) {
    const orderings = get_all_anchor_orderings(anchor_indices, layer.length);
    let min_ordering = null;
    let min_angle = 2*Math.PI;
    console.log('New');
    for (let i = 0; i < orderings.length; i++) {
        const angles = orderings[i][0].map(anchor_idx => anchors[anchor_idx].angle)
        let ordering_angle = 0;
        for (let j = 1; j < angles.length; j++) {
            const prev = angles[j - 1];
            const curr = angles[j];

            ordering_angle += clockwise_distance(curr, prev);
        }

        if (ordering_angle < min_angle) {
            min_angle = ordering_angle;
            min_ordering = orderings[i];
        }
        console.log(ordering_angle);
    }
    if (min_ordering == null) {
        debugger;
    }

    if (does_ordering_fit(layer, min_ordering[1])) {
        return min_ordering;
    }

    return null;
}

class RandomLayering {

    compute_bindings(anchors, connections) {
        const layers = [
            new_empty_layer(anchors.length),
        ];
        const lookup = {};

        Object.values(anchors).forEach((anchor, idx) => {
            lookup[`${anchor.in ? 'in' : 'out'}${anchor.target}`] = idx;
        })

        const connections_as_anchors = connections.map(conn => conn.nodes.map(node_id => {
            const anchor_idx = lookup[`${conn.in ? 'in' : 'out'}${node_id}`]
            if (anchor_idx === undefined) {
                throw new Error(`Could not find a proper anchor for a binding: ${`${conn.in ? 'in' : 'out'}${node_id}`}`);
            }
            return anchor_idx;
        }))

        const sequences_with_layer_number = []
        connections_as_anchors.forEach(connection => {
            let last_layer = layers[layers.length - 1];
            let fitting_order = get_fitting_ordering(last_layer, connection, anchors)
            if (fitting_order == null) {
                layers.push(new_empty_layer(anchors.length))
                last_layer = layers[layers.length - 1];
                fitting_order = get_fitting_ordering(last_layer, connection, anchors)
            }
            for (let i = 0; i < fitting_order[1].length; i++) {
                last_layer[fitting_order[1][i]] = 1;
            }

            sequences_with_layer_number.push({
                sequence: fitting_order[0],
                layer_n: layers.length - 1,
            })
            
        })
        return [layers, sequences_with_layer_number];
    }
}

export default RandomLayering;