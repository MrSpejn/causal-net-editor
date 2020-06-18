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
    compute_bindings(anchors: Array<Anchor>, connections: Array<Connection>): Array<Binding>;
}

export interface Constructable<T> {
    new(...args: any) : T;
}