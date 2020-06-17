import Elk from 'elkjs'
import _ from 'lodash'

class SugiyamaLayout {
    constructor() {
        this.elk = new Elk()
    }
    compute_positions(adj_matrix, node_ids, width, height) {
        const graph = {
            id: "root",
            layoutOptions: {
                'elk.algorithm': 'layered',
            },
            children: node_ids.map(id => ({
                id: `${id}`,
                width: width,
                height: height,
            })),
            edges: _.flatten(adj_matrix.map((row, row_id) => row.map((cell, col_id) => (cell ? ({
                id: `${node_ids[row_id]}-${node_ids[col_id]}`,
                sources: [`${node_ids[row_id]}`],
                targets: [`${node_ids[col_id]}`]
            }) : null )))).filter(edge => edge != null)
        }
        
        return this.elk.layout(graph)
            .then(output => this.reduce_to_common_standard(output))
    }

    reduce_to_common_standard(output) {
        try {
            return {
                nodes: output.children.map(n => ({"id": n.id, "position": [n.x + n.width / 2, n.y + n.height / 2]})),
                edges: output.edges.map(e => ({
                    start_id: e.id.split('-')[0],
                    end_id: e.id.split('-')[1],
                    points: _.flatten(e.sections.map(section => ([
                        [section.startPoint.x, section.startPoint.y],
                        ...(section.bendPoints || []).map(point => ([point.x, point.y])),
                        [section.endPoint.x, section.endPoint.y],
                    ])))
                }))
            }
        } catch (e) {
            console.error('Error while standirizing SugiyamaLayout output')
            console.error(e)
        }
    }
}

export default SugiyamaLayout