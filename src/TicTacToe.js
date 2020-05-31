import React from 'react';
import ReactDom from 'react-dom';

export default class TicTacToeGame extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [ {
              squares: Array(9).fill(null),
              clickedCell : Array(2).fill(null),
            }],
            isNextX : true,
            stepNumber: 0,
        }
    }

    render() {

        const history = this.state.history;
        const current = history[this.state.stepNumber];

        const squares = current.squares;

        const lastMove = current.clickedCell.reduce((x,y) => {
                if( x === null || y === null)
                    return 'N/A';
                else
                    return `${x},${y}`;
            });

        const status = this.getStatus(squares);

        const moves = history.reverse().map((step, move) => {
            let index = history.length - 1 - move;
            const desc = index ?
              'Go to move #' + index + ` at (${step.clickedCell[0]},${step.clickedCell[1]})` :
              'Go to game start';
            return (
              <li key={index}>
                <button onClick={() => this.jumpTo(index)}>{desc}</button>
              </li>
            );
          });

        return (
            <div className = 'game'>
                <h1>Welcome to Tic Tac Toe</h1>
                <div className = 'game-board'>
                    <Board squares = {squares} onClick = {(row,column) => this.clickHandler(row,column)}/>
                </div>
                <div className = 'game-info'>
                    <div>{status}</div>
                    <div>Last move: <strong>{lastMove}</strong></div>
                    <ol>{moves}</ol>
                </div>
                <h3>Have Nice Game!!</h3>
            </div>
        );
    }

    jumpTo(move) {
        this.setState({
            isNextX : move % 2, 
            stepNumber : move
        });
    }

    clickHandler = (row,column) => {

        const sizeOfGrid = 3;
        const index = row * sizeOfGrid + column;

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];

        let squares = current.squares.slice();

        if(squares[index] || this.getWinner(squares) )
            return;

        squares[index] = this.state.isNextX ? 'X' : 'O';

        this.setState({
            history : history.concat([
            { 
                squares: squares,
                clickedCell : [row,column]
            }]),
             isNextX : !this.state.isNextX,
            stepNumber : history.length
        });
    }

    getStatus = (squares) => {
        let winner = this.getWinner(squares);

        if(winner) {
            return 'Winner: ' + winner;
        } else {
            return 'Next Move: ' + (this.state.isNextX ? 'X' : 'O');
        }
    }

    getWinner = (squares) => {
        const winnerCases =  [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];

        for (let line = 0; line < winnerCases.length; line++) {

            const [x,y,z] = winnerCases[line];

            if(squares[x] && squares[x] === squares[y]
                && squares[x] === squares[z])
                    return squares[x];
        }
        return null;
    }
}

class Board extends React.Component {

    renderSquare(row,column) {

        const SizeOfGrid = 3;

        let i = row * SizeOfGrid + column;
        return (
            <Square value = {this.props.squares[i]} onClick = {() => {this.props.onClick(row,column);}}/>
        );
    }

    render() {

        let numbers = [[0,1,2], [3,4,5], [6,7,8]];
        //let numbers = Array(3).fill(Array(3).keys());

        return (
                <div id = 'board'>
                    {
                        numbers.map((value,index) => {
                            return (
                                <div id = {`div${index + 1}`}>
                                    {
                                        value.map((item,index2) => {
                                            return (this.renderSquare(index,index2));
                                    })}
                                </div>
                            );
                        })
                    }
                </div>
        );
    }
}

function Square(props) {
    return (
        <button class = 'buttonName' onClick = {props.onClick} ><strong>{props.value}</strong></button>
    );
}