import BaseLayering from "./BaseLayering";
import { BindingLayering, Binding } from "./types";
import { Anchor } from "../graphVisualization/types";
import {
    getAllAnchorOrderings,
    newEmptyLayer,
    computeClockwiseLengthOfOrdering,
    doesOrderingFit,
    applyOrderingToLayer,
    PairOfSequences,
} from '../bindingLayeringAlgorithms/utils';

class GreedyLayering extends BaseLayering implements BindingLayering {

    computeBindings(anchors: Array<Anchor>, anchorConnections: Array<Array<number>>): [Array<Binding>, Array<Array<number>>] {
        const layers = [
            newEmptyLayer(anchors.length),
        ];
        const choosenSequencesWithLayers = []

        for (let anchorSequence of anchorConnections) {
            const orderings = getAllAnchorOrderings(anchorSequence, anchors.length);

            let fittingOrdering: PairOfSequences | null = null;

            for (let layerNo = 0; layerNo < layers.length; layerNo++) {
                const layer = layers[layerNo];
                for (let ordering of orderings) {
                    if (doesOrderingFit(layer, ordering[1])) {
                        fittingOrdering = ordering
                        break
                    }
                }
                if (fittingOrdering != null) {
                    applyOrderingToLayer(layer, fittingOrdering[1])
                    choosenSequencesWithLayers.push({
                        sequence: fittingOrdering[0],
                        layer_n: layerNo,
                    });
                    break
                } 
            }
            if (fittingOrdering == null) {
                layers.push(newEmptyLayer(anchors.length))
                applyOrderingToLayer(layers[layers.length - 1], orderings[0][1])
                choosenSequencesWithLayers.push({
                    sequence: orderings[0][0],
                    layer_n: layers.length - 1,
                });
            }

        }

        return [choosenSequencesWithLayers, layers]
    }
}

export default GreedyLayering