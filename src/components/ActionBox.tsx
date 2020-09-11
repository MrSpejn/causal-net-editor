import React from 'react';
import { Paper, TextField, Button } from '@material-ui/core';

interface Props {
    addingNodes: boolean,
    onNodeAdd: (text: string) => void,
}

interface State {
   errorMessage: string,
   textValue: string,
}

class ActionBox extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            errorMessage: "",
            textValue: "",
        }
    }

    onNodeAdd = () => {
        const value = this.state.textValue.trim();
        if (value === "") {
            this.setState({ errorMessage: "Cannot be empty" });
            return;
        }

        this.setState({
            errorMessage: "",
            textValue: "",
        });

        this.props.onNodeAdd(value);
    }

    render() {
        if (!this.props.addingNodes) {
            return <div />;
        }

        return (
            <Paper className="action-info" elevation={3}>
                <p className="action-info__action-name">Adding nodes</p>
                <TextField
                    error={this.state.errorMessage !== ""}
                    id="input-node-text"
                    label="Input node name"
                    value={this.state.textValue}
                    onChange={(e) => this.setState({ textValue: e.target.value })}
                    helperText={this.state.errorMessage}
                />
                <Button onClick={this.onNodeAdd}>Add</Button>
            </Paper>
        );
    }
}

export default ActionBox;
