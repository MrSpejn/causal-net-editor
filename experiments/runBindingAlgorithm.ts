import fs from 'fs';
import path from 'path';
import Worker from 'tiny-worker';
import cliProgress from 'cli-progress';
import {
    maxArcAbsoluteMetric,
    maxArcRadialMetric,
    nLayersMetric,
} from './metrics/bindingMetrics';
import { StandarisedLayout } from '../src/layoutAlgorithms/types';
import { BindingLayering } from '../src/bindingLayeringAlgorithms/types';
import { NEATO_LAYOUT, layouts } from '../src/layoutAlgorithms';
import { bindingAlgorithms, GREEDY_LAYERING, RANDOM_LAYERING, VARIANT_SEARCH_LAYERING, ADVANCED_VARIANT_SEARCH_LAYERING} from '../src/bindingLayeringAlgorithms';
import Graph, { INCOMMING, OUTGOING } from '../src/graphRepresentation/Graph';
import { Node }  from '../src/graphRepresentation/types';
import { constructViznode } from '../src/graphVisualization/GraphVisualization'; 
import * as conf from '../src/graphVisualization/config';

function mean(list) {
    return list.reduce((sum, x) => sum + x, 0) / list.length
}

function chainLayerers(layererSet, graphs, worker, idx) {
    if (idx >= layererSet.length) {
        return Promise.resolve(true);
    }
    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    // const bar = {
    //     start: (a, b) => {},
    //     increment: (a, b) => {},
    // };

    bar.start(graphs.length, 0);

    return chainGraphs(layererSet[idx], graphs, worker, 0, [], bar).then((data) => {
        saveResults(data, graphs, layererSet[idx]);
        return chainLayerers(layererSet, graphs, worker, idx + 1);
    });
}

const config =    {
    [conf.NODE_HEIGHT]: 50,
    [conf.NODE_WIDTH]: 50,
    [conf.ARR_LENGTH]: 6,
    [conf.ARR_WIDTH]: 8,
    [conf.LINE_WIDTH]: 1,
    [conf.BINDING_FIRST_LAYER]: 50,
    [conf.BINDING_PER_LAYER]: 7,
    [conf.BINDING_SIZE]: 4,
};

function chainGraphs(layerer, graphs, worker, idx, results, bar) {
    if (idx >= graphs.length) {
        return Promise.resolve(results);
    }
    return runLayerer(layerer, graphs[idx], worker).then((data) => {
        results.push(data);
        bar.increment();
        return chainGraphs(layerer, graphs, worker, idx + 1, results, bar);
    });
}

function runLayerer(layerer, graph, worker) {
    const fields = graph.split(';')

    const graphPath = `./experiments/instances/${fields[1]}/graph-${fields[0]}.json`;
    const generatedGraph = Graph.fromJSON(fs.readFileSync(graphPath).toString());
    const LayoutAlg = new layouts[NEATO_LAYOUT]({
        worker,
    }, {});
    return LayoutAlg.computePositions(
        generatedGraph.adj_matrix,
        generatedGraph.nodes.map(n => n.id.toString()),
        1920,
        1080,
    ).then((layout) => {
        let hrTime = process.hrtime()
        const start = hrTime[0] * 1000000 + hrTime[1] / 1000;
        const results = runLayeringAlgoritmForGraph(
            layout,
            generatedGraph.nodes,
            new bindingAlgorithms[layerer.alg](),
        );

        hrTime = process.hrtime()
        const end = hrTime[0] * 1000000 + hrTime[1] / 1000;

        return {
            maxArcAbsolute: mean(results.map(x => x.maxArcAbsolute)),
            maxArcRadial: mean(results.map(x => x.maxArcRadial)),
            nLayers: mean(results.map(x => x.nLayers)),
            time: end - start,

        };
    }).catch((err) => {
        console.error('Something went wrong')
        return {
            maxArcAbsolute: null,
            maxArcRadial: null,
            nLayers: null,
            time: null,
        }
    });
}

function runLayeringAlgoritmForGraph(graph: StandarisedLayout, nodes: Array<Node>, alg: BindingLayering) {

    const vizNodes = graph.nodes.map((node, idx) => constructViznode(node, nodes[idx], graph.edges, conf));
    const results = [];
    for (let vizNode of vizNodes) {
        const connections = [
            ...vizNode.node[INCOMMING].map(conn => ({ in: true, nodes: conn })),
            ...vizNode.node[OUTGOING].map(conn => ({ in: false, nodes: conn })),
        ]
        const anchorConnections = alg.translateToAnchorIndexConnections(vizNode.anchors, connections);
        const[bindings, layers] = alg.computeBindings(vizNode.anchors, anchorConnections);
        
        results.push({
            nLayers: nLayersMetric(vizNode.anchors, bindings, layers),
            maxArcAbsolute: maxArcAbsoluteMetric(vizNode.anchors, bindings, layers),
            maxArcRadial: maxArcRadialMetric(vizNode.anchors, bindings, layers),
            
        });
    }
    return results
}

const RESULT_FILE = './experiments/results/bindings-results.csv';

function saveResults(results, graphs, layerer) {
    results.forEach((metrics, idx) => {
        const graphUUID = graphs[idx].split(';')[0];
        fs.appendFileSync(
            RESULT_FILE,
            `\n${layerer.name};${graphUUID};${Object.values(metrics).join(";")}`,
        );
    });
}

const layererSet = [
    {
        name: "Random",
        alg: RANDOM_LAYERING,
    },
    {
        name: "Greedy",
        alg: GREEDY_LAYERING,
    },
    {
        name: "VariantSearch",
        alg: VARIANT_SEARCH_LAYERING,
    },
    {
        name: "AdvancedVariantSearch",
        alg: ADVANCED_VARIANT_SEARCH_LAYERING,
    },
];

function main() {
    const graphs = fs.readFileSync("./experiments/instances/graphs-bindings.csv").toString().split('\n').slice(1);
    // const graphs = [
    //     'ae125d76-d399-409d-bd5d-d2cc30942c25;0.6_0.6'
    // ]
    const worker = new Worker(path.resolve(__dirname, '../public/full.render.js'));
    fs.writeFileSync(
        RESULT_FILE,
        `name;graph-uuid;maxAngleArc;maxAngleLength;nLayers;time`,
    );

    chainLayerers(layererSet, graphs, worker, 0).then(() => {
        setTimeout(() => {
            //@ts-ignore
            worker.terminate();
            process.exit();
        }, 1000);
    });
}

main();