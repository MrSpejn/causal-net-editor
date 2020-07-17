import React from 'react';

import InteractivityController from '../canvasIntercativity/InteractivityController';
import { Button } from '@material-ui/core';

interface Props {
    controller: InteractivityController | null,
    switchMode: () => void,
}

interface State {}

class ReplayMenu extends React.Component<Props, State> {
    render() {
        return (
            <div className="app__menu">
                <div className="menu">
                <div className="menu__left-section">
                      
                </div>
                <div className="menu__center-section">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.props.switchMode}
                    >Edit Graph</Button>
                    <Button color="primary">Instructions</Button>

                </div>
                <div className="menu__right-section">
                   
                </div>
                </div>
            </div>
        );
    }
}

export default ReplayMenu;