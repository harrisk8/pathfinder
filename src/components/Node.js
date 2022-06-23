import React, {Component} from 'react';
import './Node.css';

class Node extends Component {

    render() {

        let nodeType = '';
        if (this.props.isStartNode === true) {
            nodeType = 'start-node';
        } else if (this.props.isEndNode === true) {
            nodeType = 'end-node';
        } else if (this.props.isWall === true) {
            nodeType = 'wall-node';
        }

        return (
            <div className={`node ${nodeType}`}
                id={`node-${this.props.row}-${this.props.column}`}
                onMouseDown={()=>this.props.onMouseDown(this.props.row, this.props.column)}
                onMouseEnter={()=>this.props.onMouseEnter(this.props.row, this.props.column)}
                onMouseUp={()=>this.props.onMouseUp()}
            >
            </div>
        );
    }
}

export default Node;