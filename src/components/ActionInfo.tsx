import React from 'react';
import { Paper } from '@material-ui/core';

import { ConnectionInProgress } from '../graphRepresentation/types';

interface Props {
    connectionInProgress: ConnectionInProgress | null,
    addingConnectionOut: boolean,
    addingConnectionIn: boolean,
    removingConnection: boolean,
    removingNodes: boolean,
}

interface State {
   
}

class ActionInfo extends React.Component<Props, State> {
    renderConnectionProgress(incomming: boolean) {
        return (
            <div>
                <p className="action-info__action-name">{incomming ? "To: " : "From: "}</p>
                <p className="action-info__action-target">
                    {this.props.connectionInProgress!.origin != null ? this.props.connectionInProgress!.origin : "__"}
                </p>
                <p className="action-info__action-name">{incomming ? " From: " : " To: "}</p>
                <p className="action-info__action-target">
                    [{this.props.connectionInProgress!.destination.join(", ")}]
                </p>
            </div>
        );
      
    }
    renderContent() {
        if (this.props.addingConnectionOut) {
            return (
                <div>
                    <p className="action-info__action-name">Adding outgoing connection</p>
                    {this.renderConnectionProgress(false)}
                </div>
            );
        } else if (this.props.addingConnectionIn) {
            return (
                <div>
                    <p className="action-info__action-name">Adding incomming connection</p>
                    {this.renderConnectionProgress(true)}
                </div>
            );
        } else if (this.props.removingConnection) {
            return (
                <p className="action-info__action-name">Removing connections</p>
            )
        } else if (this.props.removingNodes) {
            return (
                <p className="action-info__action-name">Removing nodes</p>
            )
        } else {
            return "";
        }
    }
    render() {
        return (
            <Paper className="action-info" elevation={3}>
                {this.renderContent()}
            </Paper>
        );
    }
}

export default ActionInfo;