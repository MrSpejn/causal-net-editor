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
            let fitting_order = getFittingOrdering(last_layer, anchorIdx, anchors)
            if (fitting_order === null) {
                layers.push(newEmptyLayer(anchors.length))
                last_layer = layers[layers.length - 1];
                fitting_order = getFittingOrdering(last_layer, anchorIdx, anchors)!
            }

            applyOrderingToLayer(last_layer, fitting_order[1])

            sequescesWithLayerNumber.push({
                sequence: fitting_order[0],
                layer_n: layers.length - 1,
            });
            
        })
        return [sequescesWithLayerNumber, layers];
    }
}

export default RandomLayering;