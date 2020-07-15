const _ = require('lodash');

function new_empty_layer(n) {
    return _.range(n).map(() => 0);
}

function get_sequences(anchors) {
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
        if (last === max) {
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

function get_fitting_ordering(layer, anchor_indices) {
    const orderings = get_all_anchor_orderings(anchor_indices, layer.length);
    for (let i = 0; i < orderings.length; i++) {
        if (does_ordering_fit(layer, orderings[i][1])) {
            return orderings[i];
        }
    }
    return null;
}

class RandomLayering {

    computeBindings(anchors, connections) {
        const layers = [
            new_empty_layer(anchors.length),
        ];
        const lookup = {};

        Object.values(anchors).forEach((anchor, idx) => {
            lookup[`${anchor.in ? 'in' : 'out'}${anchor.target}`] = idx;
        })

        const connections_as_anchors = connections.map(conn => conn.nodes.map(node_id => {
            return lookup[`${conn.in ? 'in' : 'out'}${node_id}`]
        }))

        const sequences_with_layer_number = []

        connections_as_anchors.forEach(connection => {
            let last_layer = layers[layers.length - 1];
            let fitting_order = get_fitting_ordering(last_layer, connection)
            if (fitting_order === null) {
                layers.push(new_empty_layer(anchors.length))
                last_layer = layers[layers.length - 1];
                fitting_order = get_fitting_ordering(last_layer, connection)
            }
            for (let i = 0; i < fitting_order[1].length; i++) {
                last_layer[fitting_order[1][i]] = 1;
            }
            console.log('last layer', last_layer)
            sequences_with_layer_number.push({
                sequence: fitting_order[0],
                layer_n: layers.length - 1,
            })
            
        })
        return [layers, sequences_with_layer_number];
    }
}

const anchors = [
    {
        'in': true,
        'target': 0, 
    },
    {
        'in': false,
        'target': 0, 
    },
    {
        'in': true,
        'target': 1, 
    },
    {
        'in': true,
        'target': 2, 
    },
    {
        'in': false,
        'target': 2, 
    },
]

const connections = [{
    in: true,
    nodes: [0, 1],
}, {
    in: false,
    nodes: [0],
}, {
    in: true,
    nodes: [0, 1, 2],
}, {
    in: true,
    nodes: [0, 2],
}, {
    in: false,
    nodes: [0, 2],
}]

const binder = new RandomLayering();
const result = binder.computeBindings(anchors, connections)
console.log(result[0])
console.log(result[1])