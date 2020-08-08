import { Binding } from "../../../src/bindingLayeringAlgorithms/types";
import { Anchor } from "../../../src/graphVisualization/types";

export function nLayersMetric(anchors: Array<Anchor>, bindings: Array<Binding>, layers: Array<Array<number>>): number {
    return layers.length
}