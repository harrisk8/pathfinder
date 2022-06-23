import React, {Component} from 'react';
import Node from './Node';
import './Grid.css';
import { dijkstras, shortestPath } from '../algorithms/dijkstras';

let START_NODE_ROW = null;
let START_NODE_COLUMN = null;
let END_NODE_ROW = null;
let END_NODE_COLUMN = null;

class Grid extends Component {
    constructor() {
        super();
        this.state = {
            grid: [],
            mouseIsPressed: false,
            startNodeSelected: false,
            endNodeSelected: false,
        };
    }

    componentDidMount() {
        const grid = this.createGrid();
        this.setState({grid: grid});
    };

    createGrid() {
        const grid = [];
        for (let row = 0; row <= 20; row++) {
            const currentRow = [];
            for (let column = 0; column <= 45; column++) {
                currentRow.push(this.createNewNode(row, column));
            }
            grid.push(currentRow);
        }
        return grid;
    };

    createNewNode(row, column) {
        return {
            row: row,
            column: column,
            isStartNode: row === START_NODE_ROW && column === START_NODE_COLUMN,
            isEndNode: row === END_NODE_ROW && column === END_NODE_COLUMN,
            hasBeenVisited: false,
            isWall: false,
            prevNode: null,
            distance: Infinity,
        };
    }

    handleMouseDown(row, column) {

        //Handle selection for START node
        if (!this.state.startNodeSelected && !this.state.endNodeSelected) {
            const updatedGrid = this.updateGridWithStartNode(this.state.grid, row, column);
            this.setState({grid: updatedGrid, startNodeSelected: true, mouseIsPressed: true});
            START_NODE_ROW = row;
            START_NODE_COLUMN = column;
            return;
        }

        //Handle selection for END node
        if (this.state.startNodeSelected && !this.state.endNodeSelected) {
            const updatedGrid = this.updateGridWithEndNode(this.state.grid, row, column);
            this.setState({grid: updatedGrid, endNodeSelected: true, mouseIsPressed: true});
            END_NODE_ROW = row;
            END_NODE_COLUMN = column;
            return;
        }


        const updatedGrid = this.getUpdatedGridWithWalls(this.state.grid, row, column);
        this.setState({grid: updatedGrid, mouseIsPressed: true});
    }

    handleMouseEnter(row, column) {
        if (!this.state.startNodeSelected || !this.state.endNodeSelected) return;
        if (!this.state.mouseIsPressed) return;
        const updatedGrid = this.getUpdatedGridWithWalls(this.state.grid, row, column);
        this.setState({grid: updatedGrid});
        console.log("ENTER");

    }

    handleMouseUp() {
        this.setState({mouseIsPressed: false});
        console.log("UP");
    }

    updateGridWithStartNode(grid, row, column) {
        const newGrid = grid.slice();
        const node = newGrid[row][column];
        const newNode = {
            ...node,
            isStartNode: true,
        }
        newGrid[row][column] = newNode;
        return newGrid;
    }

    updateGridWithEndNode(grid, row, column) {
        const newGrid = grid.slice();
        const node = newGrid[row][column];
        const newNode = {
            ...node,
            isEndNode: true,
        }
        newGrid[row][column] = newNode;
        return newGrid;
    }

    getUpdatedGridWithWalls(grid, row, column) {
        const newGrid = grid.slice();
        const node = newGrid[row][column];
        const newNode = {
            ...node,
            isWall: !node.isWall,
        };
        newGrid[row][column] = newNode;
        return newGrid;
    }

    calculatePath() {
        const grid = this.state.grid;
        const start = grid[START_NODE_ROW][START_NODE_COLUMN];
        const end = grid[END_NODE_ROW][END_NODE_COLUMN];
        console.log("start " + start)
        console.log("end " + end)

        const visitedNodes = dijkstras(grid, start, end);
        
        const shortestNodePath = shortestPath(end);

        this.animateDijkstra(visitedNodes, shortestNodePath);

    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
          if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
              this.animateShortestPath(nodesInShortestPathOrder);
            }, 10 * i);
            return;
          }
          setTimeout(() => {
            const node = visitedNodesInOrder[i];
            document.getElementById(`node-${node.row}-${node.column}`).className =
              'node node-visited';
          }, 10 * i);
        }
      }

      animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
          setTimeout(() => {
            const node = nodesInShortestPathOrder[i];
            document.getElementById(`node-${node.row}-${node.column}`).className =
              'node node-shortest-path';
          }, 50 * i);
        }
      }



    render() {

        return (
            <>
                <h1 className='title'>Welcome to Pathfinder <span id="slogan">powered by Dijkstra's Algorithm</span></h1>

                {/*Map each row to a div, then map each node object in 2-d array to a Node component */}
                <div className="grid">
                    {this.state.grid.map((row, rowIdx) => {
                        return (
                            <div className='node-div' key={rowIdx}>
                                {row.map((node, nodeIdx) => {
                                    return (
                                        <Node
                                            key={nodeIdx}
                                            column={node.column}
                                            row={node.row}
                                            isStartNode={node.isStartNode}
                                            isEndNode={node.isEndNode}
                                            isWall={node.isWall}
                                            mouseIsPressed={this.state.mousePressed}
                                            onMouseDown={(row, column) => this.handleMouseDown(row, column)}
                                            onMouseEnter={(row, column) => this.handleMouseEnter(row, column)}
                                            onMouseUp={() => this.handleMouseUp()}
                                        >
                                        </Node>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>

                <button className='btn-hover color-9' onClick={() =>this.calculatePath()}>
                    Find Path!
                </button>

                <button className='reset' onClick={() => this.handleReset()}>
                    Reset
                </button>

                <h2 className='instructions-title'>Instructions</h2>
                <ul>
                    <li>1. Click on a tile to select the START node.</li>
                    <li>2. Click on a second tile to select the END node.</li>
                    <li>3. Click or click-and-drag to select walls.</li>
                    <li>4. Click "Find Path!" when you are ready to execute the algorithm.</li>

                </ul>
            </>
        );
    }

    handleReset() {
        window.location.reload();
        window.scrollTo(0, 0);
    }




}

export default Grid;