import BaseLayering from "./BaseLayering";
import _ from 'lodash';
import { BindingLayering, Binding, AnchorIndexSeq } from "./types";
import { Anchor } from "../graphVisualization/types";
import {
    getAllAnchorOrderings,
    newEmptyLayer,
    computeClockwiseLengthOfOrdering,
    doesOrderingFit,
    applyOrderingToLayer,
    PairOfSequences,
} from './utils';

type BindingWithVariants = {
    selectedVariant: PairOfSequences | null
    usedAnchors: AnchorIndexSeq
    variants: Array<PairOfSequences>
}

function getAllCombinations<T>(...lists: Array<Array<T>>): Array<Array<T>> {
    if (lists.length === 1) {
        return lists[0].map(el => [el]);
    }

    const allLower = getAllCombinations<T>(...lists.slice(1))
    const combinations = []
    for (let el of lists[0]) {
        combinations.push(...allLower.map(seq => [el, ...seq]));
    }
    return combinations;
}

class VariantLayer {
    state: Array<BindingWithVariants>
    size: number
    constructor(layerLength: number) {
        this.size = layerLength;
        this.state = [];
    }
    findFittingCombination(newElement: BindingWithVariants): Array<PairOfSequences> | null {
        const totalSize = this.state.reduce((sum, x) => sum + x.usedAnchors.length, 0) 
                            + newElement.usedAnchors.length;
        if (totalSize > this.size) {
            return null;
        }
        const combinations = getAllCombinations<PairOfSequences>(
            ...this.state.map(x => x.variants),
            newElement.variants,
        );
        for (let comb of combinations) {
            const len = comb.reduce((sum, x) => sum + x[1].length, 0);
            if (len > this.size) {
                continue;
            }
            const flat = _.flatten(comb.map(list => list[1]));
            const uniq = _.unionBy(flat);
            if (flat.length === uniq.length) {
                return comb;
            }
        }
        return null;
    }
    addElementWithVariants(newElement: BindingWithVariants, fitVariants: Array<PairOfSequences>) {
        this.state.push(newElement);
        this.state.forEach((state, idx) => {
            state.selectedVariant = fitVariants[idx];
        });
    }
}

class VariantSearchLayering extends BaseLayering {
    computeBindings(anchors: Array<Anchor>, anchorConnections: Array<Array<number>>): [Array<Binding>, Array<Array<number>>] {
        const layers = [
            new VariantLayer(anchors.length),
        ];

        const bindingsWithVariants = anchorConnections.map(anchorSeq => {
            const orderings = getAllAnchorOrderings(anchorSeq, anchors.length);
            return {
                variants: orderings,
                selectedVariant: null,
                usedAnchors: orderings[0][0],
            };
        });

        for (let binding of bindingsWithVariants) {
            let didFoundLayer = false;

            for (let layer of layers) {
                const fittingVariants = layer.findFittingCombination(binding);
                if (fittingVariants != null) {
                    didFoundLayer = true;
                    layer.addElementWithVariants(binding, fittingVariants);
                    break;
                }
            }
            if (!didFoundLayer) {
                const layer = new VariantLayer(anchors.length);
                const fittingVariants = layer.findFittingCombination(binding);
                layer.addElementWithVariants(binding, fittingVariants!);
                layers.push(layer);
            }   
        }
      
        const bindings = _.flatten(layers.map(
            (layer, idx) => layer.state.map(
                binding => ({
                    sequence: binding.selectedVariant![0],
                    layer_n: idx,
                })
            )
        ))
        const layerFillings = layers.map(layer => {
            const filling = _.range(anchors.length).map(() => 0);
            layer.state.forEach(binding => {
                binding.selectedVariant![1].forEach(anchorIdx => {
                    filling[anchorIdx] = 1;
                });
            });
            return filling;
        });
        return [bindings, layerFillings];
    }
}

export default VariantSearchLayering