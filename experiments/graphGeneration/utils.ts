import jStat from 'jstat';
import _ from 'lodash';

function product(iterables, repeat) {
    var argv = Array.prototype.slice.call(arguments), argc = argv.length;
    if (argc === 2 && !isNaN(argv[argc - 1])) {
        var copies = [];
      for (var i = 0; i < argv[argc - 1]; i++) {
          copies.push(argv[0].slice()); // Clone
      }
      argv = copies;
    }
    return argv.reduce(function tl(accumulator, value) {
      var tmp = [];
      accumulator.forEach(function(a0) {
        value.forEach(function(a1) {
          tmp.push(a0.concat(a1));
        });
      });
      return tmp;
    }, [[]]);
}

function dirichletSample(alphas){    
    const unnormY = alphas.map(alpha => jStat.gamma.sample(alpha, alphas.length, 1))
    const ySum = unnormY.reduce((sum, y) => sum + y)

    return unnormY.map(y => y / ySum)
}

function sampleNumberOfEdges(alphas, totalNoEdges) {
    const edges = dirichletSample(alphas).map(y => y*totalNoEdges)
    return edges.map(e => Math.random() < (e % 1) ? Math.ceil(e) : Math.floor(e))
}

function betaDistributedNumber(expected: number, maxNumber: number, width: number): number {
    const distExpected = expected / maxNumber;
    const alpha = width;
    const beta = alpha / distExpected - alpha;
    return Math.round(jStat.beta.sample(alpha, beta) * maxNumber);
}

function maxNumberOfEdges(nNodes: number): number {
    return (nNodes + 2) * nNodes;
}

function convertToPairs(path) {
    return path.slice(1).map((end, idx) => [path[idx], end])
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
    widthGraphSaturation: number,
    expectedNoNodes: number,
    expectedGraphSaturation: number,
    maxNoNodes: number,
    edgeDistributionAlpha: (number) => Array<number>,
    bindingWeights: (number, object) => number,
}

export function getRandomGraph(params: GenerationParams) {
    const noNodes = betaDistributedNumber(params.expectedNoNodes, params.maxNoNodes, params.widthNoNodes);
    const maxEdges = maxNumberOfEdges(noNodes)
    const noEdges = betaDistributedNumber(params.expectedGraphSaturation*maxEdges, maxEdges, params.widthGraphSaturation)

    const start = 0;
    const end = noNodes + 1;
    const nodes = _.range(1, noNodes + 1)
    const origins = [start, ...nodes]
    const ends = [...nodes, end]

    const firstPath = [start, ..._.shuffle(nodes), end]

    if (noEdges - (noNodes + 1) <= 0) {
        return convertToPairs(firstPath)
    }

    const dirichletAlphas = params.edgeDistributionAlpha(noNodes + 1)
    const edgeCounts = sampleNumberOfEdges(dirichletAlphas, noEdges - (noNodes + 1))

    const additionalPairs = _.flatten(origins.map((origin, i) => 
        _.shuffle(ends).slice(0, edgeCounts[i]).map(end => ([origin, end]))))

    const allNodes = [start, ...nodes, end];
    const adjMatrix = pairsToAdjMatrix([
        ...convertToPairs(firstPath),
        ...additionalPairs,
    ], allNodes)
    return [
        adjMatrix,
        allNodes,
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
    return _.uniqBy(_.range(n).map(() => {
        const values = _.range(1, targets.length + 1)
        const weights = values.map(size => weighingFn(size))
        const bindingLength = randomWeighted(values, weights)
        return _.shuffle([
            ..._.range(bindingLength).map(() => 1),
            ..._.range(targets.length - bindingLength).map(() => 0),
        ]).reduce((all, curr, idx) => (curr === 0 ? all : [...all, targets[idx]]), [])
    }), binding => binding.join(""))
   
}