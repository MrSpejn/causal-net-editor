import BaseLayering from "./BaseLayering";
import _ from 'lodash';
import { Binding, AnchorIndexSeq } from "./types";
import { Anchor } from "../graphVisualization/types";
import {
    getAllAnchorOrderings,
    PairOfSequences,
} from './utils';

type BindingWithVariants = {
    selectedVariant: PairOfSequences | null
    usedAnchors: AnchorIndexSeq
    variants: Array<PairOfSequences>
}

type VariantCombination = Array<PairOfSequences|null>

function getAllCombinations<T>(...lists: Array<Array<T>>): Array<Array<T|null>> {
    if (lists.length === 1) {
        return lists[0].map(el => [el]);
    }

    const allLower = getAllCombinations<T>(...lists.slice(1))
    const combinations = []
    for (let el of lists[0]) {
        combinations.push(...allLower.map(seq => [el, ...seq]));
    }
    combinations.push(...allLower.map(seq => [null, ...seq]));

    return combinations;
}

function doesUseMoreAnchors(c1: VariantCombination | null, c2: VariantCombination, bindings: Array<BindingWithVariants>): boolean {
    if (c1 == null) {
        return true;
    }
    const sumUsedAnchors = (sum:number, variant: PairOfSequences | null, bindingIdx :number) => 
        sum + (variant != null ? bindings[bindingIdx].usedAnchors.length : 0);
    const usedAnchors1 = c1.reduce(sumUsedAnchors, 0)
    const usedAnchors2 = c2.reduce(sumUsedAnchors, 0)
    if (usedAnchors2 > usedAnchors1) {
        return true;
    }
    return false;

}

class VariantLayer {
    state: Array<BindingWithVariants>
    size: number
    constructor(layerLength: number) {
        this.size = layerLength;
        this.state = [];
    }
    findFittingCombination(
        newElement: BindingWithVariants,
        isBetterCombination: (c1: VariantCombination | null, c2: VariantCombination, b: Array<BindingWithVariants>) => boolean
    ): Array<PairOfSequences|null> | null {
        const totalSize = this.state.reduce((sum, x) => sum + x.usedAnchors.length, 0) 
                            + newElement.usedAnchors.length;
        if (totalSize > this.size) {
            return null;
        }
        const bindings = [
            ...this.state,
            newElement,
        ]
        const combinations = getAllCombinations<PairOfSequences>(...bindings.map(b => b.variants));
        let bestFittingCombination = [...this.state.map(x => x.selectedVariant), null];
        
        for (let comb of combinations) {
            const len = comb.reduce((sum, x) => sum + (x != null ? x[1].length : 0), 0);
            if (len > this.size) {
                continue;
            }
            const flat = _.flatten(comb.map(list => list != null ? list[1] : []));
            const uniq = _.unionBy(flat);
            // This qualifies as a fitting combination
            if (flat.length === uniq.length) {
                if (isBetterCombination(bestFittingCombination, comb, bindings)) {
                    bestFittingCombination = comb;
                }
            }
        }
        return bestFittingCombination;
    }
    addElementWithVariants(newElement: BindingWithVariants, fitVariants: Array<PairOfSequences|null>): Array<BindingWithVariants> {
        this.state.push(newElement);
        const toKeep = this.state.filter((state, idx) => fitVariants[idx] != null);
        const toRemove = this.state.filter((state, idx) => fitVariants[idx] == null);
        const noNullVariants = fitVariants.filter(variant => variant != null);

        this.state = toKeep;
        this.state.forEach((state, idx) => {
            state.selectedVariant = noNullVariants[idx];
        });
        return toRemove;
    }
}

class AdvancedVariantSearchLayering extends BaseLayering {
    computeBindings(anchors: Array<Anchor>, anchorConnections: Array<Array<number>>): [Array<Binding>, Array<Array<number>>] {
        const layers = [
            new VariantLayer(anchors.length),
        ];

        const bindingsWithVariants: Array<BindingWithVariants> = anchorConnections.map(anchorSeq => {
            const orderings = getAllAnchorOrderings(anchorSeq, anchors.length);
            return {
                variants: orderings,
                selectedVariant: null,
                usedAnchors: orderings[0][0],
            };
        });

        while (bindingsWithVariants.length) {
            const binding = bindingsWithVariants.shift();
            let didFoundLayer = false;
            for (let layer of layers) {
                const fittingVariants = layer.findFittingCombination(binding!, doesUseMoreAnchors);
                if (fittingVariants != null && fittingVariants[fittingVariants.length - 1] != null) {
                    const kickedOut = layer.addElementWithVariants(binding!, fittingVariants);
                    bindingsWithVariants.push(...kickedOut);
                    didFoundLayer = true;
                    break;
                }
            }
            if (!didFoundLayer) {
                const layer = new VariantLayer(anchors.length);
                const fittingVariants = layer.findFittingCombination(binding!, doesUseMoreAnchors);
                layer.addElementWithVariants(binding!, fittingVariants!);
         
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

export default AdvancedVariantSearchLayering