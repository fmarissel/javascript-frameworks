import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const COLOR = {
    BLACK: "black",
    WHITE: "white"
}

class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
        }
    }

    render() {
        let circle;
        if (this.state.value) {
            circle = this.state.value === COLOR.BLACK ? '\u25CF' : '\u25CB';
        }

        return (
            <button className="square" onClick={() => this.setState({value: COLOR.BLACK})}>
                {circle}
            </button>
        );
    }
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square value={i}/>;
    }

    render() {
        const status = 'Next player: Black';
        const size = 8;
        let board = Array(size).fill(Array(size).fill(undefined));

        return (
            <div>
                <div className="status">{status}</div>
                {
                    board.map((row, i) =>
                        <div className="board-row">
                            {
                                row.map((col, j) => (this.renderSquare(i * size + j)))
                            }
                        </div>)
                }
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board/>
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
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
