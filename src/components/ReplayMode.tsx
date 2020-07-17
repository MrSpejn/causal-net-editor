import React from 'react';
import InteractivityController from '../canvasIntercativity/InteractivityController';
import ReplayMenu from './ReplayMenu';
import { CrossModeData } from './types';
import dragscroll from 'dragscroll';

interface Props {
    crossModeData: CrossModeData,
    switchMode: (data: CrossModeData) => void,
    children: JSX.Element
}

interface State {
    controller: InteractivityController | null,
}

class ReplayMode extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            controller: null,
        };
    }

    componentDidMount() {
        const canvas = document.querySelector('canvas')!;

        const disp = this.props.crossModeData.canvasDisplay;
        const controller = new InteractivityController(canvas, disp.scale, disp.scrollTop, disp.scrollLeft);

        controller.init(this.props.crossModeData.graph!);

        this.setState({
            controller,
        });

        dragscroll.reset();

    }

    switchMode = () => {
        const canvas = this.state.controller?.canvas;
        this.props.switchMode({
            canvasDisplay: {
                scale: this.state.controller?.scale!,
                scrollTop: canvas!.parentElement!.scrollTop,
                scrollLeft: canvas!.parentElement!.scrollLeft,
            },
            graph: this.state.controller?.graph!,
        });
    }

    render() {
        return (
            <div className="app__mode replay-mode">
                 <ReplayMenu
                    controller={this.state.controller}
                    switchMode={this.switchMode}
                />
                <div className="app__canvas-container dragscroll">
                    <canvas className="app__canvas"></canvas>
                </div>
            </div>
        );
    }
}

export default ReplayMode