import { EventEmitter } from 'typed-event-emitter';
import Graph from '../graphRepresentation/Graph';
import SugiyamaLayout from '../layoutAlgorithms/SugiyamaLayout';
import RandomLayering from '../bindingLayeringAlgorithms/RandomLayering';
import GraphVisualization from '../graphVisualization/GraphVisualization';

class InteractivityController extends EventEmitter{
    onInit = this.registerEvent<() => any>();
    visualization?: GraphVisualization;

    init(canvas: HTMLCanvasElement, graph: Graph): void {
        this.visualization = new GraphVisualization(SugiyamaLayout, RandomLayering, this);

        this.visualization.computeGraphicalRepresentation(graph).then(() => {
            canvas!.width = window.innerWidth;
            canvas!.height = window.innerHeight - 80;
            this.visualization!.drawOnCanvas(canvas!, 2, 0, 1, 80, 80);
        });

        this.emit(this.onInit);

    }

}

export default InteractivityController;