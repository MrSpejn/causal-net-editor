import { getRandomGraph, selectBindings, GenerationParams } from "./utils";
import { paramSets } from './paramsSets';

export class GraphGenerator {
    params: GenerationParams;

    generateGraphWithSpecs(specName) {
        this.params = paramSets[specName];
        const tmp = getRandomGraph(this.params)
        const adjMatrix = tmp[0]
        const nodes = tmp[1]

        const nodesWithConnections = nodes.map((node, idx) => ({
            node: node,
            in: adjMatrix
                .map((row, ridx) => ({ row, ridx }))
                .filter(({ row }) => row[idx] === 1)
                .map(({ ridx }) => nodes[ridx]),
            out: adjMatrix[idx]
                .map((cell, cidx) => ({ cell, cidx }))
                .filter(({cell}) => cell === 1)
                .map(({ cidx }) => nodes[cidx]),
        }));

        return JSON.stringify({
            nodes: nodesWithConnections.map(node => this.addBindings(node)),
        });
    }

    addBindings(node) {
        return { 
            id: node.node,
            name: node.node.toString(),
            outgoing: this.getBindingsForDirection(node.out),
            incomming: this.getBindingsForDirection(node.in),
        };
       
    }

    getBindingsForDirection(targets) {
        if (targets.length === 0) return [];
        if (targets.length === 1) return [
            [targets[0]],
        ];
        const lowerBound = Math.min(targets.length, 40);
        const upperBound = Math.min(targets.length * 2, 40);

        const nBindings = Math.random() * (upperBound - lowerBound) + lowerBound;

        return selectBindings(
            targets,
            nBindings,
            l => this.params.bindingWeights(l, { max: targets.length }),
        );
    }
}