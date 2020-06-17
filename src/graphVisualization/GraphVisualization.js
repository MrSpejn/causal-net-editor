import _ from 'lodash';
import Victor from 'victor';
import VizNode from './VizNode';
import VizEdge from './VizEdge';

import {
    OUTGOING,
    INCOMMING,
} from '../graphRepresentation/Graph';

import { findPointOnLine } from './viz_helpers';

const WIDTH = 40
const HEIGHT = 40
const X = 0
const Y = 1
const SCALE = 3
const ARR_WIDTH = 2;
const ARR_LENGTH = 3;

function constructViznode(node, edges, width, height) {
    return new VizNode(
        node.id,
        node.position,
        edges.filter(edge => edge.start_id === node.id).map(edge => ({
            'target': edge.end_id,
            'points': edge.points,
            'point': edge.points[0],

        })),
        edges.filter(edge => edge.end_id === node.id).map(edge => ({
            'target': edge.start_id,
            'points': edge.points,
            'point': edge.points[edge.points.length - 1],
        })),
        width,
        height,
    )
}

class GraphVizualization {
    constructor(layoutClass, bindingClass) {
        this.nodeLayout = new layoutClass();
        this.bindingClass = bindingClass;
    }

    computeGraphicalRepresentation(graph) {
        return (this.nodeLayout).compute_positions(
            graph.adj_matrix,
            graph.nodes.map(n => n.id),
            WIDTH,
            HEIGHT,
        ).then((output) => {
            this.viz_nodes = output.nodes.map(node => constructViznode(node, output.edges, WIDTH, HEIGHT));
            this.viz_edges = output.edges.map(edge => new VizEdge(edge.points));
            _.zip(this.viz_nodes, graph.nodes).forEach(([viz_node, graph_node]) => {
                viz_node.compute_bindings_position(
                    this.bindingClass,
                    graph_node[INCOMMING],
                    graph_node[OUTGOING],
                )
            })
        })
    }

    drawOnCanvas(canvas) {
        const context = canvas.getContext('2d');
        context.font = 'bold 48px serif';
    
        this.viz_nodes.forEach(viz_node => {
            viz_node.drawOnCanvas(context, SCALE, [X, Y]);
        });
    
        context.lineWidth = 1;
        context.strokeStyle = 'black';
    
        this.viz_edges.forEach((viz_edge) => {
            context.beginPath();
            viz_edge.points.forEach((point) => {
                context.lineTo(point[X] * SCALE, point[Y] * SCALE);
            })
            context.stroke();
            context.closePath();

            context.beginPath();
            const last = Victor(...viz_edge.points[viz_edge.points.length - 1]);
            const prelast = Victor(...viz_edge.points[viz_edge.points.length - 2]);
            
            const diff_vect = last.clone().subtract(prelast).normalize();
            diff_vect.x = diff_vect.x * ARR_LENGTH
            diff_vect.y = diff_vect.y * ARR_LENGTH
            const ortogonal = diff_vect.clone().rotateBy(Math.PI / 2).normalize();
            ortogonal.x = ortogonal.x * ARR_WIDTH / 2
            ortogonal.y = ortogonal.y * ARR_WIDTH / 2

            const points = [
                last.clone().add(diff_vect).toArray(),
                last.clone().add(ortogonal).toArray(),
                last.clone().subtract(ortogonal).toArray(),
            ]
            
            points.forEach((point) => {
                context.lineTo(point[X] * SCALE, point[Y] * SCALE);
            })
            context.closePath();
            context.fill();

        });
    }
}

export default GraphVizualization;