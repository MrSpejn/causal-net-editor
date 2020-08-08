import _ from 'lodash';
import {
    Angle,
    AnchorIdx,
    Anchor,
} from '../graphVisualization/types';
import {
    AnchorIndexSeq
} from '../bindingLayeringAlgorithms/types';

function clockwiseDistance(curr: Angle, prev: Angle): number {
    if (curr < 0 && prev >= 0) {
        curr += 2*Math.PI;
    }
    const diff = curr - prev;
    if (diff < 0) {
        return diff + 2*Math.PI;
    }
    return diff;
}

function getSequences(anchors: Array<AnchorIdx>): Array<AnchorIndexSeq> {
    const sorted_anchors = _.sortBy(anchors);
    const n = sorted_anchors.length;
    return _.range(n).map((i) => ([
        ...sorted_anchors.slice(n - i, n),
        ...sorted_anchors.slice(0, n - i)
    ]))
}

export type PairOfSequences = [AnchorIndexSeq, AnchorIndexSeq];

export function getAllAnchorOrderings(anchor_indices: Array<AnchorIdx>, n: number): Array<PairOfSequences> {
    const sparse_sequences: Array<AnchorIndexSeq> = getSequences(anchor_indices)
    const full_sequences: Array<AnchorIndexSeq> = sparse_sequences.map(seq => {
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
    return _.zip(sparse_sequences, full_sequences) as Array<PairOfSequences>;
}

export function doesOrderingFit(layer: Array<number>, ordering: AnchorIndexSeq): boolean {
    for (let i = 0; i < ordering.length; i++) {
        if (layer[ordering[i]] > 0) {
            return false;
        }
    }
    return true;
}

export function computeClockwiseLengthOfOrdering(ordering: AnchorIndexSeq, anchors: Array<Anchor>) {
    let ordering_angle = 0;
    const angles = ordering.map(anchor_idx => anchors[anchor_idx].angle)

    for (let j = 1; j < angles.length; j++) {
        const prev = angles[j - 1]!;
        const curr = angles[j]!;

        ordering_angle += clockwiseDistance(curr, prev);
    }
    return ordering_angle
} 

export function getFittingOrdering(layer: Array<number>, anchor_indices: AnchorIndexSeq, anchors: Array<Anchor>): PairOfSequences | null {
    const orderings = getAllAnchorOrderings(anchor_indices, layer.length);
    let min_ordering = null;
    let min_angle = 2*Math.PI;

    for (let i = 0; i < orderings.length; i++) {
        const ordering_angle = computeClockwiseLengthOfOrdering(orderings[i][0], anchors)

        if (ordering_angle < min_angle) {
            min_angle = ordering_angle;
            min_ordering = orderings[i];
        }
    }
    if (min_ordering === null) {
        throw new Error('Could not find valid anchor index sequence');
    }

    if (doesOrderingFit(layer, min_ordering[1])) {
        return min_ordering;
    }

    return null;
}

export function newEmptyLayer(n: number): Array<number> {
    return _.range(n).map(() => 0);
}

export function applyOrderingToLayer(layer: Array<number>, fullOrdering: AnchorIndexSeq) {
    for (let i = 0; i < fullOrdering.length; i++) {
        layer[fullOrdering[i]] = 1;
    }
}