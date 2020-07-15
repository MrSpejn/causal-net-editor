import React from 'react';
import _ from 'lodash';
import { Button } from '@material-ui/core';
import ArrowRight from '@material-ui/icons/SubdirectoryArrowRight';
import SyncDisabled from '@material-ui/icons/SyncDisabled';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';

import InteractivityController from '../canvasIntercativity/InteractivityController';
import { NodeData, AnchorData } from '../canvasIntercativity/ElementRegistry';

import ActionInfo from './ActionInfo';
import { ConnectionInProgress } from '../graphRepresentation/types';

interface Props {
    controller: InteractivityController | null,
}

interface State {
    connectionInProgress: ConnectionInProgress | null,
    addingConnectionOut: boolean,
    addingConnectionIn: boolean,
    removingConnection: boolean,
    removingNodes: boolean,
}

const initialState = {
    connectionInProgress: null,
    addingConnectionIn: false,
    addingConnectionOut: false,
    removingConnection: false,
    removingNodes: false,
};

class ControlMenu extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = initialState;
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyBoard);
    }

    componentDidUpdate(prevProps: Props, prevState: State) {
        if (this.props.controller && this.props.controller !== prevProps.controller){
            this.props.controller.onAnchorClick(this.handleAnchorClick);
            this.props.controller.onNodeClick(this.handleNodeClick);
        }
    }
    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyBoard);
    }

    handleKeyBoard = (event: KeyboardEvent) => {
        if (event.keyCode === 27) {
            this.setState({
                ...initialState,
            });
            event.preventDefault();

        } else if (event.keyCode === 13) {
            this.addConnectionAndReset();
            event.preventDefault();
        }
    }

    startAddingConnectionIn = () => {
        this.setState({ 
            ...initialState,
            addingConnectionIn: true,
            connectionInProgress: {
                in: true,
                origin: null,
                destination: [],
            },
        });
    }

    startAddingConnectionOut = () => {
        this.setState({ 
            ...initialState,
            addingConnectionOut: true,
            connectionInProgress: {
                in: false,
                origin: null,
                destination: [],
            },
        });
    }

    startRemoveConnection = () => {
        this.setState({ 
            ...initialState,
            removingConnection: true,
        });
    }

    startRemoveNode = () => {
        this.setState({ 
            ...initialState,
            removingNodes: true,
        });
    }

    addConnectionAndReset = () => {
        if (this.state.connectionInProgress && this.state.connectionInProgress.origin != null && this.state.connectionInProgress.destination.length) {
            const newGraph = this.props.controller!.graph!.addConnection(this.state.connectionInProgress);
            this.props.controller!.init(newGraph);

            this.setState({ 
                ...initialState,
            });
        }
    }

    handleNodeClick = (data: NodeData) => {
        if (this.state.removingNodes) {
            const newGraph = this.props.controller!.graph!.removeNode(parseInt(data.node.id));
            this.props.controller!.init(newGraph);
        } 
        if (this.state.addingConnectionIn || this.state.addingConnectionOut) {
            if (this.state.connectionInProgress!.origin != null) {
                this.setState({
                    connectionInProgress: ({
                        ...this.state.connectionInProgress,
                        destination: _.uniq([
                            ...this.state.connectionInProgress!.destination,
                            parseInt(data.node.id),
                        ]).filter(node => node !== this.state.connectionInProgress!.origin),
                    }) as ConnectionInProgress
                });
            } else {
                this.setState({
                    connectionInProgress: {
                        ...this.state.connectionInProgress!,
                        origin: parseInt(data.node.id),
                    }
                });
            }
            
        }
    }

    handleAnchorClick = (data: AnchorData) => {
        if (this.state.removingConnection) {
            const newGraph = this.props.controller!.graph!.editBinding(
                parseInt(data.node.id),
                parseInt(data.anchor.target),
                data.connection,
            );
            this.props.controller!.init(newGraph);
        }
    }

    render() {
        return (
            <div className="app__menu">
                <div className="menu">
                    <div className="menu__left-section">
                        <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<ArrowRight />}
                            onClick={this.startAddingConnectionOut}
                        >1:N</Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            endIcon={<ArrowRight />}
                            onClick={this.startAddingConnectionIn}
                        >N:1</Button>
                        <Button
                            variant="outlined"
                            color="primary"
                            endIcon={<SyncDisabled />}
                            onClick={this.startRemoveConnection}
                        ></Button>
                    <Button
                            variant="outlined"
                            color="primary"
                            endIcon={<RemoveCircleOutline />}
                            onClick={this.startRemoveNode}
                        ></Button>
                    </div>
                    <div className="menu__center-section">
                        <Button variant="contained" color="primary">Replay Log</Button>
                        <Button color="primary">Instructions</Button>

                    </div>
                    <div className="menu__right-section">
                        <Button variant="contained" color="secondary">Load Graph</Button>
                        <Button variant="outlined" color="secondary">Save Graph</Button>
                    </div>
                </div>
                <ActionInfo {...this.state} />
            </div>
        );
    }
}

export default ControlMenu;