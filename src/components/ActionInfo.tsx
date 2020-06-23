import React from 'react';

import { ConnectionInProgress } from './types';

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
    render() {
        return (
             <div></div>
        );
    }
}

export default ActionInfo;