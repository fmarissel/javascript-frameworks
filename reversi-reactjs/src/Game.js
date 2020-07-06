import React from 'react';
import './index.css';
import Board from "./Board";
import {COLOR, SIZE} from './constants';
import HelpContext from "./HelpContext";

// const NextPlayer = React.createContext(COLOR.BLACK);

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
            stepNumber: 0,
            enabled: false,
            next: COLOR.BLACK,
            toggle: () => {
                this.setState({enabled: !this.state.enabled});
            },
            isValidSquare: this.isLegalMove.bind(this)
        }
    }

    handleClick(i, j) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];

        // you can't use current.board.slice() on multi-dimensional array because array aren't immutable
        let board = current.board.map(row => row.slice());
        let next = current.next;

        if (this.isLegalMove(next, board, i, j)) {
            board = this.playMove(next, board, i, j);

            next = this.getNextPlayer(next, board);
            this.setState({
                history: history.concat([{
                    board: board,
                    next: next
                }]),
                next: next,
                stepNumber: history.length
            });
        }
    }

    isLegalMove(next, board, i, j) {
        // square already filled
        if (board[i][j]) {
            return false;
        }

        return this.isLegalDirection(i, j, true, false, false, false, board, next)
            || this.isLegalDirection(i, j, true, false, true, false, board, next)
            || this.isLegalDirection(i, j, false, false, true, false, board, next)
            || this.isLegalDirection(i, j, false, true, true, false, board, next)
            || this.isLegalDirection(i, j, false, true, false, false, board, next)
            || this.isLegalDirection(i, j, false, true, false, true, board, next)
            || this.isLegalDirection(i, j, false, false, false, true, board, next)
            || this.isLegalDirection(i, j, true, false, false, true, board, next);
    }

    isLegalDirection(i, j, up, down, left, right, board, next) {

        const opponent = this.getOpponent(next);

        let mi = i, mj = j, c = 0;
        mi = up ? mi - 1 : (down ? mi + 1 : i);
        mj = left ? mj - 1 : (right ? mj + 1 : j);

        while ((mi > 0 || !up) && (mi < SIZE - 1 || !down) && (mj > 0 || !left) && (mj < SIZE - 1 || !right) && board[mi][mj] === opponent) {
            mi = up ? mi - 1 : (down ? mi + 1 : i);
            mj = left ? mj - 1 : (right ? mj + 1 : j);
            c += 1;
        }

        return c > 0 && mi >= 0 && mi <= SIZE - 1 && mj >= 0 && mj <= SIZE - 1 && board[mi][mj] === next;
    }

    playMove(next, board, i, j) {
        board[i][j] = next;

        board = this.playDirection(i, j, true, false, false, false, board, next);
        board = this.playDirection(i, j, true, false, true, false, board, next);
        board = this.playDirection(i, j, false, false, true, false, board, next);
        board = this.playDirection(i, j, false, true, true, false, board, next);
        board = this.playDirection(i, j, false, true, false, false, board, next);
        board = this.playDirection(i, j, false, true, false, true, board, next);
        board = this.playDirection(i, j, false, false, false, true, board, next);
        board = this.playDirection(i, j, true, false, false, true, board, next);

        return board;
    }

    playDirection(i, j, up, down, left, right, board, next) {

        const opponent = this.getOpponent(next);
        const boardTmp = board.map(row => row.slice());

        let mi = i, mj = j, c = 0;
        mi = up ? mi - 1 : (down ? mi + 1 : i);
        mj = left ? mj - 1 : (right ? mj + 1 : j);

        while ((mi > 0 || !up) && (mi < SIZE - 1 || !down) && (mj > 0 || !left) && (mj < SIZE - 1 || !right) && board[mi][mj] === opponent) {
            boardTmp[mi][mj] = next;
            mi = up ? mi - 1 : (down ? mi + 1 : i);
            mj = left ? mj - 1 : (right ? mj + 1 : j);
            c += 1;
        }

        if (c > 0 && mi >= 0 && mi <= SIZE - 1 && mj >= 0 && mj <= SIZE - 1 && board[mi][mj] === next) {
            board = boardTmp;
        }

        return board;
    }

    getOpponent(color) {
        return color === COLOR.BLACK ? COLOR.WHITE : COLOR.BLACK;
    }

    getNextPlayer(current, board) {
        let next = current === COLOR.BLACK ? COLOR.WHITE : COLOR.BLACK;

        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                if (this.isLegalMove(next, board, i, j)) {
                    return next;
                }
            }
        }

        return current;
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];

        const isFinished = current.board.every(row => row.every(value => value));

        let status;
        if (!isFinished) {
            status = 'Prochain joueur : ' + current.next.name;
        } else {
            const blackCount = current.board.flat().reduce((count, val) => count + (val === COLOR.BLACK), 0);
            status = blackCount === 32 ? "EGALITE !" : ((blackCount > 32 ? COLOR.BLACK.name : COLOR.WHITE.name) + " VAINQUEUR !");
        }

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
            <HelpContext.Provider value={this.state}>
                <div className="game">
                    <div className="game-board">
                        <Board board={current.board}
                               onClick={(i, j) => this.handleClick(i, j)}/>
                    </div>
                    <div className="game-info">
                        <div className="status">{status}</div>
                        <ol>{moves}</ol>
                    </div>
                    <div className="game-info">
                        <div>Aide :</div>
                        <HelpContext.Consumer>
                            {context => (
                                <button className="help-button"
                                        onClick={() => context.toggle()}>{(context.enabled ? "Masquer" : "Afficher") + " les coups possibles"}
                                </button>
                            )}

                        </HelpContext.Consumer>
                        <div>Règles</div>
                        <ol>
                            <li>NOIR joue en premier.</li>
                            <li>Un pion doit être adjacent à un pion adverse et doit encadrer un ou plusieurs pions
                                adverses.
                            </li>
                            <li>Les pions encadrés sont retournés sans réaction en chaîne.</li>
                            <li>Les joueurs jouent chacun leur tour.</li>
                            <li>Un joueur passe son tour si il ne peut pas jouer de coup légal.</li>
                            <li>Le joueur ayant le plus de pion de sa couleur à la fin gagne.</li>
                        </ol>
                    </div>
                </div>
            </HelpContext.Provider>
        );
    }
}

export default Game;