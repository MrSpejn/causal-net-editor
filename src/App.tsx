import React from 'react';
import Graph from './graphRepresentation/Graph';

import JSONGraph from './graph3';
import InteractivityController from './canvasIntercativity/InteractivityController';
import ControlMenu from './components/ControlMenu';

interface Props {}

interface State {
    controller: InteractivityController | null,
}

class App extends React.Component<Props, State> {
    canvas?: HTMLCanvasElement;

    constructor(props: Props) {
        super(props);

        this.state = {
            controller: null,
        };
    }

    componentDidMount() {
        const graph = Graph.fromJSON(JSON.stringify(JSONGraph));
        const canvas = document.querySelector('canvas')!;
        const controller = new InteractivityController(canvas);

        controller.init(graph);
        this.setState({
            controller,
        });
    }

    render() {
        return (
            <div className="app">
                <ControlMenu controller={this.state.controller} />
                <div className="app__canvas-container dragscroll">
                    <canvas ref={(ref) => { this.canvas = ref!; }} className="app__canvas"></canvas>
                </div>
            </div>
        );
    }
}

export default App;