import {
    SMALL_N_EDGES,
    MID_N_EDGES,
    LARGE_N_EDGES,
    MID_TALL,
    MID_STANDARD,
    MID_RANDOM,
} from './graphGeneration/paramsSets';
import { GraphGenerator } from './graphGeneration/GraphGenerator';
import { DOT_LAYOUT, layouts } from '../src/layoutAlgorithms';
import Graph from '../src/graphRepresentation/Graph';
import fs from 'fs';
import path from 'path';
import Worker from 'tiny-worker';

import {
    aspectRatioMetric,
    medianEdgeBreaksMetric,
    nCrossingEdgesMetric,
} from './metrics/layoutMetrics';
const generator = new GraphGenerator();

let generatedGraphJSON = generator.generateGraphWithSpecs(SMALL_N_EDGES);
fs.writeFileSync("./experiments/instances/graph.json", generatedGraphJSON);

const generatedGraph = Graph.fromJSON(generatedGraphJSON)

const worker = new Worker(path.resolve(__dirname, '../public/full.render.js'));
const LayoutAlg = new layouts[DOT_LAYOUT]({
    worker,
});
LayoutAlg.computePositions(
    generatedGraph.adj_matrix,
    generatedGraph.nodes.map(n => n.id.toString()),
    1920,
    1080,
).then((layout) => {
    worker.terminate();
    console.log({
        aspectRatio: aspectRatioMetric(layout, 16/8),
        medianEdgeBreaks: medianEdgeBreaksMetric(layout),
        crossedEdges: nCrossingEdgesMetric(layout),
    });
});
