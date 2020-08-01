import React, { ChangeEvent } from 'react';
import InteractivityController from '../canvasIntercativity/InteractivityController';
import ReplayMenu from './ReplayMenu';
import { CrossModeData } from './types';
import dragscroll from 'dragscroll';
import { readSingleFile } from '../utils/utils';
import XESLogLoader from '../logLoaders/XESLogLoader';
import ProcessLog from '../logLoaders/ProcessLog';
import ReplayControls from './ReplayControls';

interface Props {
    crossModeData: CrossModeData,
    switchMode: (data: CrossModeData) => void,
    children: JSX.Element
}

interface State {
    controller: InteractivityController | null,
    log: ProcessLog | null,
}

class ReplayMode extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            controller: null,
            log: null,
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

    loadLog = (event: ChangeEvent<HTMLInputElement>) => {
        readSingleFile(event.target!.files![0]).then(text => {
            const loader = new XESLogLoader();
            loader.loadLog(text).then(log => {
                this.setState({
                    log,
                });
            });
        });
    }

    render() {
        return (
            <div className="app__mode replay-mode">
                <ReplayMenu
                    controller={this.state.controller}
                    switchMode={this.switchMode}
                    loadLog={this.loadLog}
                />
                <div className="app__canvas-container dragscroll">
                    <canvas className="app__canvas"></canvas>
                </div>
                <ReplayControls />
            </div>
        );
    }
}

export default ReplayMode