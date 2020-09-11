import _ from 'lodash';
import VizNode from './VizNode';
import VizEdge from './VizEdge';

import Graph, {
    OUTGOING,
    INCOMMING,
} from '../graphRepresentation/Graph';
import { Node } from '../graphRepresentation/types';

import CanvasDrawingContext from './CanvasDrawingContext';
import { StandarisedLayoutNode, StandarisedLayoutEdge, GraphLayout, StandarisedLayout } from '../layoutAlgorithms/types';
import { Constructable, BindingLayering } from '../bindingLayeringAlgorithms/types';
import ElementRegistry from '../canvasIntercativity/ElementRegistry';
import { LINE_WIDTH, ARR_LENGTH, ARR_WIDTH } from './config';

const WIDTH = 30
const HEIGHT = 30

export function constructViznode(layoutNode: StandarisedLayoutNode, node: Node, edges: Array<StandarisedLayoutEdge>,
                          config: { [key: string]: any; }): VizNode {
    return new VizNode(
        layoutNode.id,
        node,
        layoutNode.position,
        edges.filter(edge => edge.start_id === layoutNode.id).map(edge => ({
            'target': edge.end_id.toString(),
            'points': edge.points,
            'point': edge.points[0],
        })),
        edges.filter(edge => edge.end_id === layoutNode.id).map(edge => ({
            'target': edge.start_id.toString(),
            'points': edge.points,
            'point': edge.points[edge.points.length - 1],
        })),
        config,
    )
}

class GraphVizualization {
    bindingClass: Constructable<BindingLayering>;
    graphLayout: GraphLayout;
    vizNodes: Array<VizNode>;
    vizEdges: Array<VizEdge>;
    context: CanvasDrawingContext | null;
    elementRegistry: ElementRegistry;
    config: { [key: string]: any; };

    constructor(layout: GraphLayout, 
                bindingClass: Constructable<BindingLayering>, 
                elementRegistry: ElementRegistry,
                config:{ [key: string]: any; },
                ) {
        this.graphLayout = layout;
        this.bindingClass = bindingClass;
        this.vizNodes = [];
        this.vizEdges = [];
        this.context = null;
        this.elementRegistry = elementRegistry;
        this.config = config;
    }

    computeGraphicalRepresentation(graph: Graph): Promise<StandarisedLayout> {
        return (this.graphLayout).computePositions(
            graph.adj_matrix,
            graph.nodes.map(n => n.id.toString()),
            WIDTH,
            HEIGHT,
        ).then((output: StandarisedLayout) => {
            this.vizNodes = output.nodes.map((layoutNode: StandarisedLayoutNode, idx: number) => 
                constructViznode(layoutNode, graph.nodes[idx], output.edges, this.config));
            this.vizEdges = output.edges.map((edge: StandarisedLayoutEdge) => 
                new VizEdge(edge.start_id, edge.end_id, edge.points));

            _.zip(this.vizNodes, graph.nodes).forEach(([vizNode, graphNode]) => {
                vizNode!.computeBindingsPosition(
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
        this.context = new CanvasDrawingContext(canvas, SCALE, X, Y, shiftX, shiftY);
    
        this.vizNodes.forEach(vizNode => {
            vizNode.draw(this.context!, this.elementRegistry!);
        });
        
        this.vizEdges.forEach((viz_edge) => {
            this.context!.drawSegmentedArrow(viz_edge.points, {
                lineWidth: this.config[LINE_WIDTH],
                arr_length: this.config[ARR_LENGTH], 
                arr_width: this.config[ARR_WIDTH],
                strokeStyle: 'black',
            });
        });
    }
}

export default GraphVizualization;