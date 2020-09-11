import React from 'react';

import { Dialog, DialogTitle, DialogContent } from '@material-ui/core';

interface Props {
    closeModal: () => void,
    isModalOpen: boolean,
}

interface State {
   
}

class InstructionModal extends React.Component<Props, State> {
    render() {
        return (
            <Dialog 
                open={this.props.isModalOpen}
                onClose={this.props.closeModal}>
                <DialogTitle>How to use the editor</DialogTitle>
                <DialogContent>
                    <p>The buttons on the left allow to enter one of the 5 edit modes:</p>
                    <ul>
                        <li>Adding nodes</li>
                        <li>Adding outgoing bindings</li>
                        <li>Adding incomming bindings</li>
                        <li>Removing bindings</li>
                        <li>Removing nodes</li>
                    </ul>
                    <p>To leave the edit mode use Escape button.</p>
                    <p>To remove the edge connecting activites remove all bindings from that edge.</p>
                    <p>The while "adding in/out bindings" first click on node that will be the start or the target of the binding
                       and then click on all the other nodes that should be connected. The box on the left side
                       displays the progress of the binding in creation. When all the correct nodes are selected press Enter.</p>
                    <p>The "Adding nodes" mode is the only one that is available before any graph if loaded.
                        In that case after creating a first node new graph will be started.</p>
                </DialogContent>
            </Dialog>
        );
    }
}

export default InstructionModal;
