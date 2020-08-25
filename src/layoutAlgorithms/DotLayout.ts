// @ts-ignore
import Viz from 'viz.js'
import _ from 'lodash'

import { AdjacencyMatrix } from '../graphRepresentation/types';
import { StandarisedLayout, GraphLayout, ConstructParams } from './types';
import { Point } from '../graphVisualization/types';
import { findPointOnLine } from '../graphVisualization/viz_helpers';

class DotLayout implements GraphLayout {
    engine: string = "dot"
    viz: any
    layoutParams: object;
    constructor(params: ConstructParams, layoutParams: object = {}) {
        if (!params) {
            this.viz = new Viz({workerURL: "./full.render.js"})
        } else {
            this.viz = new Viz(params)
        }
        this.layoutParams = layoutParams;
    }
    computePositions(adj_matrix: AdjacencyMatrix, node_ids: Array<string>, width: number, height: number): Promise<StandarisedLayout> {        
        const edges: string[] = []
        adj_matrix.forEach((row, rowID) => row.forEach((cell, colID) => {
            if (cell > 0) {
                edges.push(`${node_ids[rowID]} -> ${node_ids[colID]} [minlen=1,len=1];`)
            }
        }))

        const nodes = node_ids.map(id => `${id} [width=0.01, height=0.01]`)
        const graph = `digraph G {
            ${Object.entries(this.layoutParams).map((pair) => `${pair[0]} = ${pair[1]}`).join("\n")}
            \n${nodes.join("\n")} \n${edges.join("\n")}\n
        }
        `
        return this.viz.renderJSONObject(graph, { engine: this.engine })
            .then((output: any) => this.reduceToCommonStandard(output))
    }

    reduceToCommonStandard(output: any): StandarisedLayout {
        try {
            const width = parseFloat(output.bb.split(",")[3])
            const node_ids = output.objects!.map((n: any) => n)
            const standardForm = {
                nodes: output.objects!.map((n: any) => ({
                    "id": n.name,
                    "position": [
                        width - parseFloat(n.pos.split(",")[1]),
                        parseFloat(n.pos.split(",")[0]),
                    ] as Point,
                })),
                edges: output.edges!.map((e: any) => ({
                    start_id: node_ids[e.tail].name,
                    end_id: node_ids[e.head].name,
                    points: moveFirstToLast(e.pos.slice(2).split(" ").map((point: any) => ([
                        width - parseFloat(point.split(",")[1]),
                        parseFloat(point.split(",")[0]),
                    ])))
                })),
            }
            standardForm.nodes = _.sortBy(standardForm.nodes, n => parseInt(n.id))
            addCloserPointsToEdges(standardForm, 2)
            return standardForm
        } catch (e) {
            console.error(e)
            throw new Error(`Error while standirizing DotLayout output: ${e}`);
        }
    }
}

function addCloserPointsToEdges(standardForm: any, radius: number) {
    standardForm.edges.forEach((edge: any) => {
        const origin = standardForm.nodes[parseInt(edge.start_id)].position
        const destination = standardForm.nodes[parseInt(edge.end_id)].position
        
        edge.points.unshift(findPointOnLine(origin, [origin, edge.points[0]], radius))
        edge.points.push(findPointOnLine(destination, [destination, edge.points[edge.points.length - 1]], radius))
        
        // edge.points = edge.points.reverse();
    });
}
function moveFirstToLast(seq: any) {
    seq.push(seq.shift())
    return seq
}
export default DotLayout