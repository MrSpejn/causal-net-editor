
// import Elk, { ELK, ElkEdge, ElkNode, ElkExtendedEdge } from 'elkjs'
// import _ from 'lodash'

// import { AdjacencyMatrix } from '../graphRepresentation/types';
// import { StandarisedLayout, GraphLayout, ConstructParams } from '../layoutAlgorithms/types';
// import { Point } from '../graphVisualization/types';

class SugiyamaLayout {
    // elk: ELK;
    // constructor(params: ConstructParams) {
    //     this.elk = new Elk()
    // }
    // computePositions(adj_matrix: AdjacencyMatrix, node_ids: Array<string>, width: number, height: number): Promise<StandarisedLayout> {
    //     const graph = {
    //         id: "root",
    //         layoutOptions: {
    //             'elk.algorithm': 'layered',
    //             'elk.spacing.nodeNode': '40',
    //             'elk.spacing.nodeSelfLoop': '30',
    //             'elk.layered.spacing.nodeNodeBetweenLayers': '50',
    //             'elk.layered.spacing.edgeNodeBetweenLayers': '50',
    //             'elk.spacing.edgeNode': '50',
    //         },
    //         children: node_ids.map(id => ({
    //             id: `${id}`,
    //             width: width,
    //             height: height,
    //         })),
    //         edges: _.flatten(adj_matrix.map((row, row_id) => row.map((cell, col_id) => (cell ? ({
    //             id: `${node_ids[row_id]}-${node_ids[col_id]}`,
    //             sources: [`${node_ids[row_id]}`],
    //             targets: [`${node_ids[col_id]}`]
    //         }) : null )))).filter(edge => edge != null) as Array<ElkEdge>
    //     }
        
    //     return this.elk.layout(graph)
    //         .then(output => this.reduceToCommonStandard(output))
    // }

    // reduceToCommonStandard(output: ElkNode): StandarisedLayout {
    //     try {
    //         return {
    //             nodes: output.children!.map(n => ({
    //                 "id": n.id,
    //                 "position": [
    //                     n.x! + n.width! / 2,
    //                     n.y! + n.height! / 2
    //                 ] as Point,
    //             })),
    //             edges: output.edges!.map((e) => ({
    //                 start_id: e.id.split('-')[0],
    //                 end_id: e.id.split('-')[1],
    //                 points: _.flatten((e as ElkExtendedEdge).sections.map(section => ([
    //                     [
    //                         section.startPoint.x,
    //                         section.startPoint.y,
    //                     ],
    //                     ...(section.bendPoints || []).map((point) => ([
    //                         point.x,
    //                         point.y
    //                     ])),
    //                     [
    //                         section.endPoint.x,
    //                         section.endPoint.y
    //                     ],
    //                 ]))) as Array<Point>,
    //             })),
    //         }
    //     } catch (e) {
    //         throw new Error('Error while standirizing SugiyamaLayout output');
    //     }
    // }
}

export default SugiyamaLayout