import { getRandomGraph, createReachabilityMatrix } from "./graphGeneration/utils";
import _ from 'lodash';
import { matrix, subset, index } from 'mathjs';
const params =  {
    widthNoNodes: 100,
    widthGraphSaturation: 100,
    expectedNoNodes: 12,
    expectedGraphSaturation: .3,
    maxNoNodes: 20,
    edgeDistribution: number => _.range(number).map(() => 10),
    bindingWeights: (bindingLen, params) => Math.pow(3, params.max - bindingLen + 1),
    tierWeights: [1, 1, 1]
};

_.range(1000).forEach(() => {
    const [adjMatrix, names] = getRandomGraph(params);

    const reach = createReachabilityMatrix(matrix(adjMatrix));
    const reachableFromStart = _.flatten(
            subset(reach, index(0, _.range(1, names.length))).toArray() as number[]
        )
    const endReachableFrom = _.flatten(
            subset(reach, index(_.range(names.length - 1), names.length - 1)).toArray() as number[]
        )

    if (!reachableFromStart.every(v => v === 1) || !endReachableFrom.every(v => v === 1)) {
        throw 'Tantrum';
    }
});
