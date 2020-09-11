import React from 'react';
import _ from 'lodash';
import { Button } from '@material-ui/core';
import ArrowRight from '@material-ui/icons/SubdirectoryArrowRight';
import SyncDisabled from '@material-ui/icons/SyncDisabled';
import AddCircleOutline from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline';

import InteractivityController from '../canvasIntercativity/InteractivityController';
import { NodeData, AnchorData } from '../canvasIntercativity/ElementRegistry';

import ActionInfo from './ActionInfo';
import { ConnectionInProgress } from '../graphRepresentation/types';
import Graph from '../graphRepresentation/Graph';
import ActionBox from './ActionBox';
import InstructionModal from './InstructionsModal';

interface Props {
    controller: InteractivityController | null,
    switchMode: () => void,
}

interface State {
    connectionInProgress: ConnectionInProgress | null,
    addingConnectionOut: boolean,
    addingConnectionIn: boolean,
    addingNodes: boolean,
    removingConnection: boolean,
    removingNodes: boolean,
    isInstructionModalOpen: boolean,
}

const initialState = {
    connectionInProgress: null,
    addingConnectionIn: false,
    addingConnectionOut: false,
    addingNodes: false,
    removingConnection: false,
    removingNodes: false,
    isInstructionModalOpen: false,
};

function downloadObjectAsJson(exportObj: object, exportName = "graph"){
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

function readFile(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = e => resolve(e.target!.result as string);
        reader.onerror = error => reject(error);
        reader.onabort = abort => reject(abort);

        reader.readAsText(file);
    });
}
class EditMenu extends React.Component<Props, State> {
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

    openInstructionModal = () => {
        this.setState({
            ...this.state,
            isInstructionModalOpen: true,
        });
    }

    closeInstructionModal = () => {
        this.setState({
            ...this.state,
            isInstructionModalOpen: false,
        });
    }

    loadGraph = (event: any) => {
        readFile(event.target.files[0])
            .then((graphString) => {
                this.props.controller!.init(Graph.fromJSON(graphString));
            })
            .catch((error) => {
                this.props.controller!.graph = undefined;
                console.error(error);
            });
    }

    saveGraph = () => {
        if (this.props.controller && this.props.controller.graph) {
            downloadObjectAsJson({nodes: this.props.controller!.graph!.nodes});
        }
    }
    
    handleKeyBoard = (event: KeyboardEvent) => {
        if (this.props.controller) {
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
       
    }

    addNode = (text: string) => {
        let graph;
        if (this.props.controller!.graph) {
            graph = this.props.controller!.graph!.addNode(text);
        } else {
            graph = Graph.createGraph(text);
        }

        this.props.controller!.init(graph);
    }

    startAddingNode = () => {
        if (this.props.controller) {
            this.setState({ 
                ...initialState,
                addingNodes: true,
            });
        }
    }

    startAddingConnectionIn = () => {
        if (this.props.controller && this.props.controller.graph) {
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
    }

    startAddingConnectionOut = () => {
        if (this.props.controller && this.props.controller.graph) {
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
                            data.node.node,
                        ]).filter(node => node !== this.state.connectionInProgress!.origin),
                    }) as ConnectionInProgress
                });
            } else {
                this.setState({
                    connectionInProgress: {
                        ...this.state.connectionInProgress!,
                        origin: data.node.node,
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
                            startIcon={<AddCircleOutline />}
                            onClick={this.startAddingNode}
                        ></Button>
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
                        {/* <Button
                            variant="contained"
                            color="primary"
                            onClick={this.props.switchMode}
                            disabled
                        >Replay Log</Button> */}
                        <Button
                            color="primary"
                            onClick={this.openInstructionModal}
                        >Instructions</Button>

                    </div>
                    <div className="menu__right-section">
                        <div>
                            <input
                                accept="application/json"
                                id="upload-button"
                                type="file"
                                style={{display: 'none'}}
                                onChange={this.loadGraph}
                            />
                            <label htmlFor="upload-button">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    component="span"
                                >
                                    Load Graph
                                </Button>
                            </label>
                        </div>
                        <div style={{marginLeft: 10}}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={this.saveGraph}
                            >
                                Save Graph
                            </Button>
                        </div>
                    </div>
                </div>
                <ActionInfo {...this.state} />
                <ActionBox
                    onNodeAdd={this.addNode}
                    addingNodes={this.state.addingNodes}
                />
                <InstructionModal
                    isModalOpen={this.state.isInstructionModalOpen}
                    closeModal={this.closeInstructionModal}
                />
            </div>
        );
    }
}

export default EditMenu;