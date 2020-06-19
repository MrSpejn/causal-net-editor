import _ from 'lodash';

import { EventEmitter } from 'typed-event-emitter';
import Graph from '../graphRepresentation/Graph';
import SugiyamaLayout from '../layoutAlgorithms/SugiyamaLayout';
import RandomLayering from '../bindingLayeringAlgorithms/RandomLayering';
import GraphVisualization from '../graphVisualization/GraphVisualization';
import { compute_bounding_box } from '../layoutAlgorithms/utils';

class InteractivityController extends EventEmitter {
    onInit = this.registerEvent<() => any>();
    canvas?: HTMLCanvasElement;
    visualization?: GraphVisualization;
    scale: number = 1;

    init(canvas: HTMLCanvasElement, graph: Graph): void {
        this.visualization = new GraphVisualization(SugiyamaLayout, RandomLayering, this);
        this.renderGraphOnScreen(graph);
        this.canvas = canvas;
        const debouncedRender = _.debounce(() => {
            this.renderGraphOnScreen(graph);
        }, 0);

        canvas.parentElement?.addEventListener('wheel', event => {
            event.preventDefault();
            event.stopPropagation();
            this.scale += event.deltaY * -0.01 * Math.pow(this.scale, 1/4);
            this.scale = Math.min(Math.max(.125, this.scale), 12);
            debouncedRender();
        })
        this.emit(this.onInit);

    }

    renderGraphOnScreen(graph: Graph): void {
        this.visualization!.computeGraphicalRepresentation(graph).then(layout => {
            const boundingBox = compute_bounding_box(layout, this.scale);
            const minWidth = this.canvas!.parentElement!.clientWidth;
            const minHeight = this.canvas!.parentElement!.clientHeight;
            this.canvas!.width = Math.max(boundingBox.width, minWidth);
            this.canvas!.height = Math.max(boundingBox.height, minHeight);

            const marginLeft = Math.max(minWidth - boundingBox.width, 0) / 2;
            const marginTop = Math.max(minHeight - boundingBox.height, 0) / 2;
            console.log(marginLeft, marginTop);
            this.visualization!.drawOnCanvas(
                this.canvas!,
                this.scale,
                0, 1,
                -1 * boundingBox.x + marginLeft,
                -1 * boundingBox.y + marginTop,
            );
        });
    }

}

export default InteractivityController;