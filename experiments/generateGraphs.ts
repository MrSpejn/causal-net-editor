import { v4 as uuid } from 'uuid';
import fs from 'fs';
import _ from 'lodash';
import { GraphGenerator } from './graphGeneration/GraphGenerator';
import Graph from '../src/graphRepresentation/Graph';
import * as math from 'mathjs';

function comb(k, n) {
    return math.combinations(n, k)
}

function sumCombinations(n) {
    return _.range(1, n + 1).reduce((sum, k) => sum + comb(k, n));
}

function fractionOfAll(frac) {
    return targets => Math.floor(frac * sumCombinations(targets.length));
}

function fractionOfAllWithMax(frac, max) {
    return targets => Math.max(Math.floor(frac * sumCombinations(targets.length)), max);
}

const generator = new GraphGenerator();
const baseParams = {
    widthNoNodes: 100,
    widthGraphSaturation: 100,
    expectedNoNodes: 12,
    maxNoNodes: 20,
    edgeDistribution: number => _.range(number).map(() => 1),
    bindingWeights: (bindingLen, params) => comb(bindingLen, params.max),
    tierWeights: _.range(4).map(() => 1),
    nBindLowerBound: fractionOfAllWithMax(.4, 6),
    nBindUpperBound: fractionOfAllWithMax(.401, 6),
};
// 
// nBindUpperBound

const saturations = [.2, .4, .6, .8]
const tiers = [12, 6, 2]
const groups = []

saturations.forEach(sat => {
    tiers.forEach(ntier => {
        groups.push([`${sat}_${ntier}`, {
            ...baseParams,
            expectedGraphSaturation: sat,
            tierWeights: _.range(ntier).map(() => 1),

        }])
    });
});

// const groups = [
//     ['0.2_0.2', {
//         ...baseParams,
//         expectedGraphSaturation: .2,
//         nBindLowerBound: fractionOfAll(.2),
//         nBindUpperBound: fractionOfAll(.201),
//     }],
//     ['0.2_0.4', {
//         ...baseParams,
//         expectedGraphSaturation: .2,
//         nBindLowerBound: fractionOfAll(.4),
//         nBindUpperBound: fractionOfAll(.401),
//     }],
//     ['0.2_0.6', {
//         ...baseParams,
//         expectedGraphSaturation: .2,
//         nBindLowerBound: fractionOfAll(.6),
//         nBindUpperBound: fractionOfAll(.601),
//     }],
//     ['0.2_0.8', {
//         ...baseParams,
//         expectedGraphSaturation: .2,
//         nBindLowerBound: fractionOfAll(.8),
//         nBindUpperBound: fractionOfAll(.801),
//     }],
//     ['0.4_0.2', {
//         ...baseParams,
//         expectedGraphSaturation: .4,
//         nBindLowerBound: fractionOfAll(.2),
//         nBindUpperBound: fractionOfAll(.201),
//     }],
//     ['0.4_0.4', {
//         ...baseParams,
//         expectedGraphSaturation: .4,
//         nBindLowerBound: fractionOfAll(.4),
//         nBindUpperBound: fractionOfAll(.401),
//     }],
//     ['0.4_0.6', {
//         ...baseParams,
//         expectedGraphSaturation: .4,
//         nBindLowerBound: fractionOfAll(.6),
//         nBindUpperBound: fractionOfAll(.601),
//     }],
//     ['0.4_0.8', {
//         ...baseParams,
//         expectedGraphSaturation: .4,
//         nBindLowerBound: fractionOfAll(.8),
//         nBindUpperBound: fractionOfAll(.801),
//     }],
//     ['0.6_0.2', {
//         ...baseParams,
//         expectedGraphSaturation: .6,
//         nBindLowerBound: fractionOfAll(.2),
//         nBindUpperBound: fractionOfAll(.201),
//     }],
//     ['0.6_0.4', {
//         ...baseParams,
//         expectedGraphSaturation: .6,
//         nBindLowerBound: fractionOfAll(.4),
//         nBindUpperBound: fractionOfAll(.401),
//     }],
//     ['0.6_0.6', {
//         ...baseParams,
//         expectedGraphSaturation: .6,
//         nBindLowerBound: fractionOfAll(.6),
//         nBindUpperBound: fractionOfAll(.601),
//     }],
//     ['0.6_0.8', {
//         ...baseParams,
//         expectedGraphSaturation: .6,
//         nBindLowerBound: fractionOfAll(.8),
//         nBindUpperBound: fractionOfAll(.801),
//     }],
// ];

const CSV_PATH = './experiments/instances/graphs-layouts.csv';

fs.writeFileSync(CSV_PATH, "uuid;set;generation_params;nodes;adj_matrix;bindings;details");
groups.forEach((data) => {
    const params = data[1];
    const setName = data[0];

    _.range(10).forEach(() => {
        const tmp = generator.generateGraphWithSpecs(params);
        const generatedGraphJSON = tmp[0];
        const generatedGraph = Graph.fromJSON(generatedGraphJSON);
        const id = uuid();
        const dir = `./experiments/instances/${setName}`;
    
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(`${dir}/graph-${id}.json`, generatedGraphJSON);
        const csvRow = [
            id,
            setName,
            JSON.stringify(params),
            generatedGraph.nodes.length,
            JSON.stringify(generatedGraph.adj_matrix),
            JSON.stringify(generatedGraph.nodes.map(n => [
                ...n.incomming.map(c => ({ in: true, conn: c })),
                ...n.outgoing.map(c => ({ in: false, conn: c })),
            ])),
            JSON.stringify(tmp[1]),
        ];
        fs.appendFileSync(CSV_PATH, '\n' + csvRow.join(";"));
    });    
});
