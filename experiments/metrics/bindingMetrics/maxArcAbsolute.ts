import { Binding } from "../../../src/bindingLayeringAlgorithms/types";
import { Anchor } from "../../../src/graphVisualization/types";
import { computeClockwiseLengthOfOrdering } from "../../../src/bindingLayeringAlgorithms/utils";

export function maxArcAbsoluteMetric(anchors: Array<Anchor>, bindings: Array<Binding>, layers: Array<Array<number>>): number  {
    let max = 0;
    for (let binding of bindings) {
        const angle = computeClockwiseLengthOfOrdering(binding.sequence, anchors);
        if (angle > max) {
            max = angle * (binding.layer_n + 1);
        }
    }
    return max;
}