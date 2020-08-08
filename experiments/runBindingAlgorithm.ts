import { bindingAlgorithms, RANDOM_LAYERING } from '../src/bindingLayeringAlgorithms';
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
import Graph, { INCOMMING, OUTGOING } from '../src/graphRepresentation/Graph';
import fs from 'fs';
import path from 'path';
import Worker from 'tiny-worker';
import { StandarisedLayout } from '../src/layoutAlgorithms/types';
import { BindingLayering } from '../src/bindingLayeringAlgorithms/types';
import { constructViznode } from '../src/graphVisualization/GraphVisualization';
import { nLayersMetric, maxArcAbsoluteMetric,  maxArcRadialMetric } from './metrics/bindingMetrics';
import { Node } from '../src/graphRepresentation/types';

function main() {
    const generator = new GraphGenerator();

    let generatedGraphJSON = generator.generateGraphWithSpecs(SMALL_N_EDGES);

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
        runBindingAlgoritmForGraph(layout, generatedGraph.nodes, new bindingAlgorithms[RANDOM_LAYERING]());
    });
}

function runBindingAlgoritmForGraph(graph: StandarisedLayout, nodes: Array<Node>, alg: BindingLayering) {
    const vizNodes = graph.nodes.map((node, idx) => constructViznode(node, nodes[idx], graph.edges, 50, 50));
    for (let vizNode of vizNodes) {
        const connections = [
            ...vizNode.node[INCOMMING].map(conn => ({ in: true, nodes: conn })),
            ...vizNode.node[OUTGOING].map(conn => ({ in: false, nodes: conn })),
        ]
        const anchorConnections = alg.translateToAnchorIndexConnections(vizNode.anchors, connections);
        const[bindings, layers] = alg.computeBindings(vizNode.anchors, anchorConnections);
        
        console.log({
            nLayersMetric: nLayersMetric(vizNode.anchors, bindings, layers),
            maxArcAbsoluteMetric: maxArcAbsoluteMetric(vizNode.anchors, bindings, layers),
            maxArcRadialMetric: maxArcRadialMetric(vizNode.anchors, bindings, layers),
        });
    }

}

main()