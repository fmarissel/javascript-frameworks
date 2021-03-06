import React from 'react';
import './index.css';
import {SIZE} from './constants';
import HelpContext from "./HelpContext";

function Square(props) {
    return (
        <button className={props.className} onClick={props.onClick}>
            {props.value ? props.value.color : null}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i, j) {
        return <HelpContext.Consumer key={i * SIZE + j}>
            {context =>
                <Square key={i * SIZE + j}
                        value={this.props.board[i][j]}
                        onClick={() => this.props.onClick(i, j)}
                        className={"square" + (context.enabled && context.isValidSquare(context.next, this.props.board, i, j) ? " square-valid" : "")}/>
            }
        </HelpContext.Consumer>
    }

    render() {
        return (
            <div>
                {
                    this.props.board.map((row, i) =>
                        <div key={i} className="board-row">
                            {
                                row.map((col, j) => (this.renderSquare(i, j)))
                            }
                        </div>)
                }
            </div>
        );
    }
}

export default Board;