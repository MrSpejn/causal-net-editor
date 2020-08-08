import { GenerationParams } from "./utils";
import _ from "lodash";

export const SMALL_N_EDGES = 'SMALL_N_EDGES';
export const MID_N_EDGES = 'MID_N_EDGES';
export const LARGE_N_EDGES = 'LARGE_N_EDGES';
export const MID_TALL = 'MID_TALL';
export const MID_STANDARD = 'MID_STANDARD';
export const MID_RANDOM = 'MID_RANDOM';

const exponentialLower = (bindingLen, params) => Math.pow(2, params.max - bindingLen + 1);
const exponentialHigher = (bindingLen, params) => Math.pow(2, bindingLen - 1);

export const paramSets: { [key: string]: GenerationParams } = {
    [SMALL_N_EDGES]: {
        widthNoNodes: 100,
        widthGraphSaturation: 100,
        expectedNoNodes: 12,
        expectedGraphSaturation: .3,
        maxNoNodes: 20,
        edgeDistributionAlpha: number => _.range(number).map(() => 10),
        bindingWeights: exponentialLower,
    },
    [MID_N_EDGES]: {
        widthNoNodes: 100,
        widthGraphSaturation: 100,
        expectedNoNodes: 12,
        expectedGraphSaturation: .5,
        maxNoNodes: 20,
        edgeDistributionAlpha: number => _.range(number).map(() => 10),
        bindingWeights: exponentialLower,
    },
    [LARGE_N_EDGES]: {
        widthNoNodes: 100,
        widthGraphSaturation: 100,
        expectedNoNodes: 12,
        expectedGraphSaturation: .8,
        maxNoNodes: 20,
        edgeDistributionAlpha: number => _.range(number).map(() => 10),
        bindingWeights: exponentialLower,
    },
    [MID_TALL]: {
        widthNoNodes: 100,
        widthGraphSaturation: 100,
        expectedNoNodes: 12,
        expectedGraphSaturation: .8,
        maxNoNodes: 20,
        edgeDistributionAlpha: number => _.shuffle([
            ..._.range(number).map(() => 1),
            ..._.range(Math.floor(number / 2)).map(() => 10)
        ]).slice(0, number),
        bindingWeights: exponentialLower,

    },
    [MID_STANDARD]: {
        widthNoNodes: 100,
        widthGraphSaturation: 100,
        expectedNoNodes: 12,
        expectedGraphSaturation: .8,
        maxNoNodes: 20,
        edgeDistributionAlpha: number => _.range(number).map(() => 1),
        bindingWeights: exponentialLower,
    },
    [MID_RANDOM]: {
        widthNoNodes: 100,
        widthGraphSaturation: 100,
        expectedNoNodes: 12,
        expectedGraphSaturation: .8,
        maxNoNodes: 20,
        edgeDistributionAlpha: number => _.range(number).map(() => 1),
        bindingWeights: exponentialLower,
    },
};
