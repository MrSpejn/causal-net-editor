import React from 'react';
import { Button } from '@material-ui/core';

import InteractivityController from '../canvasIntercativity/InteractivityController';

interface Props {
    controller: InteractivityController | null,
}

interface State {}

class ControlMenu extends React.Component<Props, State> {
    componentWillReceiveProps(newProps: Props) {
        if (newProps.controller && newProps !== this.props) {
            const controller = newProps.controller;
            controller.onAnchorClick(data => {
                controller!.init(
                    controller.graph!.editBinding(
                        parseInt(data.node.id),
                        parseInt(data.anchor.target),
                        data.connection,
                    )
                )
            });
        }
    }
    render() {
        return (
            <div className="app__menu menu">
                <div className="menu__left-section">
                    <Button variant="outlined" color="primary">Add Binding</Button>

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
        );
    }
}

export default ControlMenu;