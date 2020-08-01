import React from 'react';
import ProcessLog from '../logLoaders/ProcessLog';
import LinearProgress from '@material-ui/core/LinearProgress';
import {  withStyles } from '@material-ui/core/styles';

const BorderLinearProgress = withStyles((theme) => ({
    root: {
      height: 16,
      borderRadius: 8,
      boxShadow: '0 0 6px #bbb inset',
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
      borderRadius: 8,
      backgroundColor: '#303F9F',
    },
  }))(LinearProgress);

interface Props {

}

interface State {
   log: ProcessLog,
}

class ReplayControls extends React.Component<Props, State> {
    render() {
        return (
            <div className="replay-mode__controls">
                <div className="replay-mode__control-buttons">

                </div>
                <div className="replay-mode__timeline">
                    <BorderLinearProgress variant="determinate" value={50} />
                </div>
            </div>
        );
    }
}

export default ReplayControls