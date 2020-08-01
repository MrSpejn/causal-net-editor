// @ts-ignore
import Viz from 'viz.js'
import _ from 'lodash'

import { AdjacencyMatrix } from '../graphRepresentation/types';
import { StandarisedLayout, GraphLayout } from './types';
import { Point } from '../graphVisualization/types';
import { findPointOnLine } from '../graphVisualization/viz_helpers';

class DotLayout implements GraphLayout {
    engine: string = "dot"
    viz: any
    constructor() {
        this.viz = new Viz({workerURL: "./full.render.js"})
    }
    compute_positions(adj_matrix: AdjacencyMatrix, node_ids: Array<string>, width: number, height: number): Promise<StandarisedLayout> {        
        const edges: string[] = []
        adj_matrix.forEach((row, rowID) => row.forEach((cell, colID) => {
            if (cell > 0) {
                edges.push(`${node_ids[rowID]} -> ${node_ids[colID]};`)
            }
        }))
        const graph = `digraph G {\n${edges.join("\n")}\n} `
        return this.viz.renderJSONObject(graph, { engine: this.engine })
            .then((output: any) => this.reduce_to_common_standard(output))
    }

    reduce_to_common_standard(output: any): StandarisedLayout {
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
            addCloserPointsToEdges(standardForm)
            return standardForm
        } catch (e) {
            console.error(e)
            throw new Error(`Error while standirizing DotLayout output: ${e}`);
        }
    }
}

function addCloserPointsToEdges(standardForm: any) {
    standardForm.edges.forEach((edge: any) => {
        const origin = standardForm.nodes[parseInt(edge.start_id)].position
        const destination = standardForm.nodes[parseInt(edge.end_id)].position
        
        edge.points.unshift(findPointOnLine(origin, [origin, edge.points[0]], 15))
        edge.points.push(findPointOnLine(destination, [destination, edge.points[edge.points.length - 1]], 15))
        
        // edge.points = edge.points.reverse();
    });
}
function moveFirstToLast(seq: any) {
    seq.push(seq.shift())
    return seq
}
export default DotLayout