import { DOT_LAYOUT, layouts, NEATO_LAYOUT } from '../src/layoutAlgorithms';
import Graph from '../src/graphRepresentation/Graph';
import fs from 'fs';
import path from 'path';
import Worker from 'tiny-worker';
import cliProgress from 'cli-progress';

import {
    aspectRatioMetric,
    medianEdgeBreaksMetric,
    nCrossingEdgesMetric,
    meanEdgeLengthMetric,
    meanNeighbourDistanceMetric,
} from './metrics/layoutMetrics';

function chainLayouts(layoutSet, graphs, worker, idx) {
    if (idx >= layoutSet.length) {
        return Promise.resolve(true);
    }
    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    bar.start(graphs.length, 0);

    return chainGraphs(layoutSet[idx], graphs, worker, 0, [], bar).then((data) => {
        saveResults(data, graphs, layoutSet[idx]);
        return chainLayouts(layoutSet, graphs, worker, idx + 1);
    });
}

function chainGraphs(layout, graphs, worker, idx, results, bar) {
    if (idx >= graphs.length) {
        return Promise.resolve(results);
    }
    return runLayout(layout, graphs[idx], worker).then((data) => {
        results.push(data);
        bar.increment();
        return chainGraphs(layout, graphs, worker, idx + 1, results, bar);
    });
}

function runLayout(layout, graph, worker) {
    const fields = graph.split(';')
    const graphPath = `./experiments/instances/${fields[1]}/graph-${fields[0]}.json`;
    const generatedGraph = Graph.fromJSON(fs.readFileSync(graphPath).toString());
    const LayoutAlg = new layouts[layout.layout]({
        worker,
    }, layout.params);
    return LayoutAlg.computePositions(
        generatedGraph.adj_matrix,
        generatedGraph.nodes.map(n => n.id.toString()),
        1920,
        1080,
    ).then((layout) => {
        return {
            aspectRatio: aspectRatioMetric(layout, 16/8),
            medianEdgeBreaks: medianEdgeBreaksMetric(layout),
            crossedEdges: nCrossingEdgesMetric(layout),
            meanEdgeLength: meanEdgeLengthMetric(layout),
            meanNeighourDistance: meanNeighbourDistanceMetric(layout),
        };
    }).catch((err) => {
        return {
            aspectRatio: null,
            medianEdgeBreaks: null,
            crossedEdges: null,
            meanEdgeLength: null,
            meanNeighourDistance: null,
        }
    });
}

function saveResults(results, graphs, layout) {
    results.forEach((metrics, idx) => {
        const graphUUID = graphs[idx].split(';')[0];
        fs.appendFileSync(
            saveName,
            `\n${layout.name};${graphUUID};${Object.values(metrics).join(";")}`,
        );
    });
}

const saveName = './experiments/results/layout-results.csv';
// const layoutSet = [

//     {
//         name: "layer-default",
//         layout: DOT_LAYOUT,
//         splines: "\"polyline\"",
//     },
  
//     {
//         name: "force-default",
//         layout: NEATO_LAYOUT,
//     },
// ];

const layoutSet = [
    // {
    //     name: "layer-1",
    //     layout: DOT_LAYOUT,
    //     splines: "false",	
    // },
    // {
    //     name: "layer-2",
    //     layout: DOT_LAYOUT,
    //     splines: "\"polyline\"",
    // },
    {
        name: "force-1",
        layout: NEATO_LAYOUT,
        params: {
            epsilon: 0.0001,
            model: "\"shortpath\"",
        }
    },
    {
        name: "force-2",
        layout: NEATO_LAYOUT,
        params: {
            epsilon: 0.0005,
            model: "\"shortpath\"",

        }
    },
    {
        name: "force-3",
        layout: NEATO_LAYOUT,
        params: {
            epsilon: 0.00001,
            model: "\"shortpath\"",

        }
    },
    {
        name: "force-4",
        layout: NEATO_LAYOUT,
        params: {
            epsilon: 0.0001,
            model: "\"subset\"",
        }
    },
    {
        name: "force-5",
        layout: NEATO_LAYOUT,
        params: {
            epsilon: 0.0005,
            model: "\"subset\"",
        }
    },
    {
        name: "force-6",
        layout: NEATO_LAYOUT,
        params: {
            epsilon: 0.00001,
            model: "\"subset\"",
        }
    },
];

function main() {
    const graphs = fs.readFileSync("./experiments/instances/graphs-layouts.csv").toString().split('\n').slice(1);
    const worker = new Worker(path.resolve(__dirname, '../public/full.render.js'));
    fs.writeFileSync(
        saveName,
        `name;graph-uuid;aspectRatio;meanEdgeBreaks;crossedEdges;meanEdgeLength;meanNodeDistance`,
    );

    chainLayouts(layoutSet, graphs, worker, 0).then(() => {
        setTimeout(() => {
            //@ts-ignore
            worker.terminate();
            process.exit();
        }, 1000);
    });
}

main();