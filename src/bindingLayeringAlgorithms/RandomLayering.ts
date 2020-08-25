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
    getFittingOrdering,
    newEmptyLayer,
    applyOrderingToLayer,
    getAllAnchorOrderings,
    doesOrderingFit,
} from '../bindingLayeringAlgorithms/utils';
import BaseLayering from './BaseLayering';

class RandomLayering extends BaseLayering implements BindingLayering {

    computeBindings(anchors: Array<Anchor>, anchorConnections: Array<Array<number>>): [Array<Binding>, Array<Array<number>>]  {
        const layers = [
            newEmptyLayer(anchors.length),
        ];
       
        const sequescesWithLayerNumber: Array<Binding> = [];

        anchorConnections.forEach((anchorIdx) => {
            let last_layer = layers[layers.length - 1];
            const ordering = getAllAnchorOrderings(anchorIdx, anchors.length)[0];

            if (!doesOrderingFit(last_layer, ordering[1])) {
                layers.push(newEmptyLayer(anchors.length))
                last_layer = layers[layers.length - 1];
            }

            applyOrderingToLayer(last_layer, ordering[1])

            sequescesWithLayerNumber.push({
                sequence: ordering[0],
                layer_n: layers.length - 1,
            });
            
        })
        return [sequescesWithLayerNumber, layers];
    }
}

export default RandomLayering;