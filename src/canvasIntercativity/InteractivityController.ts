
import { EventEmitter } from 'typed-event-emitter';
import Graph from '../graphRepresentation/Graph';
import { layouts } from '../layoutAlgorithms';
import { bindingAlgorithms } from '../bindingLayeringAlgorithms/';

import GraphVisualization from '../graphVisualization/GraphVisualization';
import { computeBoundingBox } from '../layoutAlgorithms/utils';
import ElementRegistry, { ElementData, ElementType, AnchorData, NodeData } from './ElementRegistry';
import { StandarisedLayout } from '../layoutAlgorithms/types';

import config from '../config.json'

function computeElementOnCanvas(event: MouseEvent, elementRegistry: ElementRegistry,
                                scale: number, offsetX: number, offsetY: number): ElementData | undefined {
    const canvas: HTMLCanvasElement = event.target! as (HTMLCanvasElement);

    const x = (event.offsetX + canvas.scrollLeft - offsetX) / scale;
    const y = (event.offsetY + canvas.scrollTop - offsetY) / scale;

    return elementRegistry?.getElementOnPosition([x, y])?.data;
}

class InteractivityController extends EventEmitter {
    onInit = this.registerEvent<() => any>();
    onNodeClick = this.registerEvent<(el: NodeData) => any>();
    onAnchorClick = this.registerEvent<(el: AnchorData) => any>();

    canvas: HTMLCanvasElement;
    graph?: Graph;
    visualization?: GraphVisualization;
    elementRegistry?: ElementRegistry;
    scale: number;
    offsetY: number = 0;
    offsetX: number = 0;
    
    constructor(canvas: HTMLCanvasElement, scale: number = 0, scrollTop: number = -1, scrollLeft: number = -1) {
        super();
        
        this.scale = scale;

        this.canvas = canvas;
        canvas.parentElement?.addEventListener('wheel', event => {
            event.preventDefault();
            event.stopPropagation();
            this.scale += event.deltaY * -0.01 * Math.pow(this.scale, 1/4);
            this.scale = Math.min(Math.max(.125, this.scale), 12);
            this.renderGraphOnScreen(this.graph!);
        });
        canvas.addEventListener('click', event => {
            const el = computeElementOnCanvas(event, this.elementRegistry!,
                                              this.scale, this.offsetX, this.offsetY);
            if (el) {
                if (el.type === ElementType.NODE) {
                    this.emit(this.onNodeClick, el as NodeData);
                } else if (el.type === ElementType.ANCHOR) {
                    this.emit(this.onAnchorClick, el as AnchorData);
                }
            }
        });
        canvas.addEventListener('mousemove', event => {
            const el = computeElementOnCanvas(event, this.elementRegistry!,
                                              this.scale, this.offsetX, this.offsetY);
            if (el) {
                this.canvas!.style.cursor = 'pointer';
            } else {
                this.canvas!.style.cursor = 'default';
            }
        });

        canvas!.height = canvas!.parentElement!.clientHeight * 2;
        canvas!.width = canvas!.parentElement!.clientWidth * 2;
        canvas.parentElement!.scrollTop = scrollTop !== -1 ? scrollTop : canvas!.parentElement!.clientHeight / 2;
        canvas.parentElement!.scrollLeft = scrollLeft !== -1 ? scrollLeft : canvas!.parentElement!.clientWidth / 2;
    }

    init(graph: Graph): void {
        this.elementRegistry = new ElementRegistry();
        this.visualization = new GraphVisualization(
            layouts[config.layout],
            bindingAlgorithms[config.bindingAlgorithm],
            this.elementRegistry,
        );
        this.visualization!.computeGraphicalRepresentation(graph).then((layout) => {
            const boundingBox = computeBoundingBox(layout, 1);
            const minWidth = this.canvas!.parentElement!.clientWidth;
            const minHeight = this.canvas!.parentElement!.clientHeight;
            
            if (this.scale === 0) {
                this.scale = Math.min(minWidth / boundingBox.width, minHeight / boundingBox.height);
            }
            this.renderGraphOnScreen(graph).then(() => {
                this.graph = graph;
                this.emit(this.onInit);
            });
        });
    
    }

    renderGraphOnScreen(graph: Graph): Promise<StandarisedLayout> {
        return this.visualization!.computeGraphicalRepresentation(graph).then(layout => {
            const boundingBox = computeBoundingBox(layout, this.scale);
            const minWidth = this.canvas!.parentElement!.clientWidth * 2;
            const minHeight = this.canvas!.parentElement!.clientHeight * 2;
            this.canvas!.width = Math.max(boundingBox.width, minWidth);
            this.canvas!.height = Math.max(boundingBox.height, minHeight);

            const marginLeft = Math.max(minWidth - boundingBox.width, 0) / 2;
            const marginTop = Math.max(minHeight - boundingBox.height, 0) / 2;

            this.offsetX = -1 * boundingBox.x + marginLeft;
            this.offsetY = -1 * boundingBox.y + marginTop;
            this.visualization!.drawOnCanvas(
                this.canvas!,
                this.scale,
                0, 1,
                this.offsetX,
                this.offsetY,
            );
            return layout;
        });
    }
    
    refreshGraph() {
        this.visualization!.drawOnCanvas(
            this.canvas!,
            this.scale,
            0, 1,
            this.offsetX,
            this.offsetY,
        );
    }

}

export default InteractivityController;