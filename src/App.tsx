import React from 'react';

import EditMode from './components/EditMode';
import ReplayMode from './components/ReplayMode';
import { CrossModeData } from './components/types';

interface Props {}

interface State {
    replayMode: boolean,
}

class App extends React.Component<Props, State> {
    canvas?: HTMLCanvasElement;
    crossModeData: CrossModeData;

    constructor(props: Props) {
        super(props);

        this.state = {
            replayMode: false,
        };

        this.crossModeData = {
            canvasDisplay: {
                scale: 0,
                scrollTop: -1,
                scrollLeft: -1,
            },
            graph: null,
        };
    }

    startReplayMode = (crossModeData: CrossModeData) => { this.crossModeData = crossModeData; this.setState({ replayMode: true }); }
    startEditMode = (crossModeData: CrossModeData) => { this.crossModeData = crossModeData; this.setState({ replayMode: false }); }

    renderCanvas() {
        return (
            <div className="app__canvas-container dragscroll">
                <canvas ref={(ref) => { this.canvas = ref!; }} className="app__canvas"></canvas>
            </div>
        );
    }
    
    renderEditMode() {
        return (
            <EditMode crossModeData={this.crossModeData} switchMode={this.startReplayMode}>
                {this.renderCanvas()}
            </EditMode>
        );
    }

    renderReplayMode() {
        return (
            <ReplayMode crossModeData={this.crossModeData} switchMode={this.startEditMode}>
                {this.renderCanvas()}
            </ReplayMode>
        );
    }

    render() {
        return (
            <div className="app">
                {this.state.replayMode ? this.renderReplayMode() : this.renderEditMode()}
            </div>
        );
    }
}

export default App;