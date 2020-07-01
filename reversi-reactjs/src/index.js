import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const COLOR = {
    BLACK: {
        name: 'BLACK',
        color: '\u25CF'
    },
    WHITE: {
        name: 'WHITE',
        color: '\u25CB'
    }
}

const SIZE = 8;

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value ? props.value.color : null}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i, j) {
        return <Square key={i * SIZE + j}
                       value={this.props.board[i][j]}
                       onClick={() => this.props.onClick(i, j)}/>;
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

class Game extends React.Component {
    constructor(props) {
        super(props);

        // initialize board
        let matrix = [];
        for (let i = 0; i < SIZE; i++) {
            matrix[i] = [];
            for (let j = 0; j < SIZE; j++) {
                matrix[i][j] = null;
            }
        }

        // initial values
        matrix[3][3] = COLOR.WHITE;
        matrix[4][4] = COLOR.WHITE;
        matrix[3][4] = COLOR.BLACK;
        matrix[4][3] = COLOR.BLACK;

        this.state = {
            history: [{
                board: matrix,
                next: COLOR.BLACK
            }],
            stepNumber: 0
        }
    }

    handleClick(i, j) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];

        // you can't use current.board.slice() on multi-dimensional array because array aren't immutable
        const board = current.board.map(row => row.slice());
        const next = current.next;

        board[i][j] = next;

        this.setState({
            history: history.concat([{
                board: board,
                next: next === COLOR.BLACK ? COLOR.WHITE : COLOR.BLACK
            }]),
            stepNumber: history.length
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const status = 'Prochain joueur : ' + current.next.name;

        const moves = history.map((step, move) => {
            const desc = move ?
                'Revenir au tour n°' + move :
                'Revenir au début de la partie';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board board={current.board}
                           onClick={(i, j) => this.handleClick(i, j)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);
