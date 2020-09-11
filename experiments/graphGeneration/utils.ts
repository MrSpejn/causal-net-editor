import jStat from 'jstat';
import { matrix, add, sum, subset, pow, Matrix, index, identity, boolean, number } from 'mathjs';
import _ from 'lodash';

function dirichletSample(alphas){    
    const unnormY = alphas.map(alpha => jStat.gamma.sample(alpha, alphas.length, 1))
    const ySum = unnormY.reduce((sum, y) => sum + y)

    return unnormY.map(y => y / ySum)
}

function sampleNumberOfEdges(alphas, totalNoEdges) {
    const sample = dirichletSample(alphas);
    const edges = sample.map(y => y*totalNoEdges)

    return edges.map(e => Math.random() < (e % 1) ? Math.ceil(e) : Math.floor(e))
}

function betaDistributedNumber(expected: number, maxNumber: number, width: number): number {
    const distExpected = expected / maxNumber;
    const alpha = width;
    const beta = alpha / distExpected - alpha;
    return Math.round(jStat.beta.sample(alpha, beta) * maxNumber);
}

function getPossibleEdges(nodeTiers: number[][]): number[] {
    const edges = [];
    for (let tierIdx = 0; tierIdx < nodeTiers.length; tierIdx++) {
        for (let node of nodeTiers[tierIdx]) {
            edges.push(nodeTiers.slice(tierIdx).reduce((sumLen, x) => sumLen + x.length, 0));
        }
    }
    return edges;
}

function pairsToAdjMatrix(pairs, nodes): Array<Array<number>> {
    const initialMatrix = nodes.map(() => nodes.map(() => 0))
    for(let pair of pairs) {
        const startIdx = nodes.indexOf(pair[0]);
        const endIdx = nodes.indexOf(pair[1]);
        initialMatrix[startIdx][endIdx] = 1;
    }
    return initialMatrix
}

export type GenerationParams = {
    widthNoNodes: number,
    tierWeights: number[],
    widthGraphSaturation: number,
    expectedNoNodes: number,
    expectedGraphSaturation: number,
    maxNoNodes: number,
    edgeDistribution: (number) => Array<number>,
    bindingWeights: (number, object) => number,
    nBindLowerBound: (targets) => number,
    nBindUpperBound: (targets) => number,
}

function generateEdgesForLoweringTiers(nodeTiers, edgeCounts) {
    const edges = []
    let nodeIdx = 0;
    nodeTiers.forEach((tier, tierIdx) => {
        const potentialEnds = _.flatten(nodeTiers.slice(tierIdx));
        for (let origin of tier) {
            const ends = _.shuffle(potentialEnds).slice(0, edgeCounts[nodeIdx]);
            edges.push(...ends.map((e) => [origin, e]));
            nodeIdx++;
        }
    });
    return edges;
}

function generateNodeTiers(nodes, params: GenerationParams): number[][] {
    const last = nodes.length - 1;
    const tieredNodes = _.groupBy(
        nodes.slice(1, last),
        n => randomWeighted(
            _.range(1, params.tierWeights.length + 1),
            params.tierWeights,
        ),
    );
    let nodeIdx = 0;
    const tiers = [
        [nodes[0]],
        ..._.sortBy(
            Object.entries(tieredNodes),
            entry => parseInt(entry[0]),
        ).map(entry => entry[1].map(() => { nodeIdx++; return nodeIdx })),
        [nodes[last]]
    ]

    return tiers;
}

export function createReachabilityMatrix(adjMatrix: Matrix): Matrix {
    const sumWithIdentity = add(adjMatrix, identity(adjMatrix.size()[0]))
    const max1matrix = number(boolean(sumWithIdentity as Matrix)) as Matrix

    return number(boolean(pow(max1matrix, max1matrix.size()[0]) as Matrix)) as Matrix
}

export function fixAdjMatrix(adjMatrix: Matrix, nodeTiers: Array<Array<number>>) {
    let reachMatrix = createReachabilityMatrix(adjMatrix);
    const size = adjMatrix.size()[0]

    // Every node should have a path to start
    nodeTiers.forEach((tier, tierIdx) => {
        for (let target of tier) {
            if (!reachMatrix.get([0, target])) {
                const potentialStarts = _.flatten(
                    nodeTiers.slice(0, tierIdx + 1).map(tier => _.shuffle(tier)),
                ).reverse();
                for (let start of potentialStarts) {                    
                    if (reachMatrix.get([0, start])) {
                        adjMatrix.set([start, target], 1);
                        const newLeadRow = number(boolean(
                            add(
                                subset(reachMatrix, index(start, _.range(size))),
                                subset(reachMatrix, index(0, _.range(size))),
                            ) as Matrix,
                        ))
                        subset(reachMatrix, index(0, _.range(size)), newLeadRow);
                        reachMatrix.set([0, target], 1);

                        break;
                    }
                }
            }
        }
    });
    // Every node should have a path to end
    reachMatrix = createReachabilityMatrix(adjMatrix);
    const end = size - 1;
    [...nodeTiers].reverse().forEach((tier, tierIdx) => {
        for (let origin of tier) {
            if (!reachMatrix.get([origin, end])) {
                const potentialTargets = _.flatten(
                    nodeTiers.slice(-1*(tierIdx+1)).map(tier => _.shuffle(tier)),
                );
                for (let target of potentialTargets) {
                    if (reachMatrix.get([target, end])) {
                        adjMatrix.set([origin, target], 1);
                        const newEndColumn = number(boolean(
                            add(
                                subset(reachMatrix, index(_.range(size), target)),
                                subset(reachMatrix, index(_.range(size), end)),
                            ) as Matrix,
                        ))
                        subset(reachMatrix, index(_.range(size), end), newEndColumn) 
                        reachMatrix.set([origin, end], 1);

                        break;
                    }
                }
            }
        }
    });
    // No start & end self loops
    adjMatrix.set([0, 0], 0);
    adjMatrix.set([end, end], 0);
}

function computeCorrection(x) {
    const min = x - 0.05
    const max = x + 0.05

    return Math.random() * (max - min) + min
}

export function getRandomGraph(params: GenerationParams): [number[][], number[], object] {
    const noNodes = betaDistributedNumber(params.expectedNoNodes, params.maxNoNodes, params.widthNoNodes);

    const start = 0;
    const end = noNodes + 1;
    const nodes = _.range(1, noNodes + 1);
    const allNodes = [start, ...nodes, end];
    const nodeTiers = generateNodeTiers(allNodes, params);

    const maxNumEdges = getPossibleEdges(nodeTiers);
    const edgeDist = params.edgeDistribution(allNodes.length);
    const edgeCounts = maxNumEdges.map((edgeCount, idx) => 
        Math.round(edgeCount * params.expectedGraphSaturation * computeCorrection(edgeDist[idx]))
    );
    const edges = generateEdgesForLoweringTiers(nodeTiers, edgeCounts);

    const adjMatrix = matrix(pairsToAdjMatrix(edges, allNodes));
    fixAdjMatrix(adjMatrix, nodeTiers);
    const reach = (createReachabilityMatrix(adjMatrix).toArray() as number[][]);
    if (!reach[0].slice(1).every(x => x === 1)) {
        throw 'Not all are reachable from start';
    }
    if (!reach.map(r => r[r.length - 1]).slice(0, -1).every(x => x === 1)) {
        throw 'Not all can reach end';
    }
    return [
        adjMatrix.toArray() as number[][],
        allNodes,
        {
            maxNumEdges,
            edgeCounts,
            nodeTiers,
            edgeDist,
        }
    ]
}

function randomWeighted(values: Array<number>, weights: Array<number>): number {
    const sum = weights.reduce((sum, v) => sum + v, 0)
    const normedWeghts = weights.map(v => v / sum)
    const random = Math.random();
    let acc = 0;
    for (let i = 0; i < normedWeghts.length; i++) {
        acc += normedWeghts[i]
        if (random <= acc) return values[i]
    }
    return values[values.length - 1]
}

export function selectBindings(targets, n, weighingFn) {
    const selectedBindings = _.uniqBy(_.range(n).map(() => {
        const values = _.range(1, targets.length + 1)
        const weights = values.map(size => weighingFn(size))
        const bindingLength = randomWeighted(values, weights)
        return _.shuffle([
            ..._.range(bindingLength).map(() => 1),
            ..._.range(targets.length - bindingLength).map(() => 0),
        ]).reduce((all, curr, idx) => (curr === 0 ? all : [...all, targets[idx]]), [])
    }), binding => binding.join(""));

    const consumedTargets = _.uniq(_.flatten(selectedBindings))
    for (let target of targets) {
        if (consumedTargets.indexOf(target) === -1) {
            selectedBindings.push([target])
        }
    }

    return selectedBindings;
}