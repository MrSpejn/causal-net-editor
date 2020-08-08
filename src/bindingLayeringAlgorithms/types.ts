import {
    Anchor,
    Connection,
    AnchorIdx,
} from '../graphVisualization/types';

export type AnchorIndexSeq = Array<AnchorIdx>;
export type Binding = {
    layer_n: number;
    sequence: AnchorIndexSeq;
};

export interface BindingLayering {
    computeBindings(anchors: Array<Anchor>, anchorConnections: Array<Array<number>>): [Array<Binding>, Array<Array<number>>];
    translateToAnchorIndexConnections(anchors: Array<Anchor>, connections: Array<Connection>): Array<Array<number>>;
}

export interface Constructable<T> {
    new(...args: any) : T;
}