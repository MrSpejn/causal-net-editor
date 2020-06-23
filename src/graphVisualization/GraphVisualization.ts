import _ from 'lodash';
import VizNode from './VizNode';
import VizEdge from './VizEdge';

import Graph, {
    OUTGOING,
    INCOMMING,
} from '../graphRepresentation/Graph';

import DrawingContext from './DrawingContext';
import { StandarisedLayoutNode, StandarisedLayoutEdge, GraphLayout, StandarisedLayout } from '../layoutAlgorithms/types';
import { Constructable, BindingLayering } from '../bindingLayeringAlgorithms/types';
import ElementRegistry from '../canvasIntercativity/ElementRegistry';

const WIDTH = 30
const HEIGHT = 30

function constructViznode(node: StandarisedLayoutNode, edges: Array<StandarisedLayoutEdge>,
                          width: number, height: number): VizNode {
    return new VizNode(
        node.id,
        node.position,
        edges.filter(edge => edge.start_id === node.id).map(edge => ({
            'target': edge.end_id.toString(),
            'points': edge.points,
            'point': edge.points[0],
        })),
        edges.filter(edge => edge.end_id === node.id).map(edge => ({
            'target': edge.start_id.toString(),
            'points': edge.points,
            'point': edge.points[edge.points.length - 1],
        })),
        width,
        height,
    )
}

class GraphVizualization {
    bindingClass: Constructable<BindingLayering>;
    graphLayout: GraphLayout;
    vizNodes: Array<VizNode>;
    vizEdges: Array<VizEdge>;
    context: DrawingContext | null;
    elementRegistry: ElementRegistry;

    constructor(layoutClass: Constructable<GraphLayout>, 
                bindingClass: Constructable<BindingLayering>, 
                elementRegistry: ElementRegistry,
                ) {
        this.graphLayout = new layoutClass();
        this.bindingClass = bindingClass;
        this.vizNodes = [];
        this.vizEdges = [];
        this.context = null;
        this.elementRegistry = elementRegistry;
    }

    computeGraphicalRepresentation(graph: Graph): Promise<StandarisedLayout> {
        return (this.graphLayout).compute_positions(
            graph.adj_matrix,
            graph.nodes.map(n => n.id.toString()),
            WIDTH,
            HEIGHT,
        ).then((output: StandarisedLayout) => {
            this.vizNodes = output.nodes.map((node: StandarisedLayoutNode) => 
                constructViznode(node, output.edges, WIDTH, HEIGHT));
            this.vizEdges = output.edges.map((edge: StandarisedLayoutEdge) => 
                new VizEdge(edge.points));

            _.zip(this.vizNodes, graph.nodes).forEach(([vizNode, graphNode]) => {
                vizNode!.compute_bindings_position(
                    this.bindingClass,
                    graphNode![INCOMMING],
                    graphNode![OUTGOING],
                );
            });
            return output;
        });
    }

    drawOnCanvas(canvas: HTMLCanvasElement, SCALE: number,
                 X: number, Y: number,
                 shiftX: number, shiftY: number): void {
        this.context = new DrawingContext(canvas, SCALE, X, Y, shiftX, shiftY);
    
        this.vizNodes.forEach(vizNode => {
            vizNode.draw(this.context!, this.elementRegistry!);
        });
        
        this.vizEdges.forEach((viz_edge) => {
            this.context!.drawSegmentedArrow(viz_edge.points, {
                lineWidth: .33,
                strokeStyle: 'black',
            });
        });
    }
}

export default GraphVizualization;