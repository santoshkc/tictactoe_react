import React from 'react';
import ReactDom from 'react-dom';
import "bootstrap/dist/css/bootstrap.css"

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
            winnerSquares : []
        }
    }

    getWinnerSquaresJsx() {
        if(this.state.winnerSquares && this.state.winnerSquares.length) {
            return (<div>
                Winning Moves: {this.state.winnerSquares.join(',')}
            </div>);
        }
        else
        {
            return (<div />);
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

        const winner = this.getWinner(squares);

        let getStatus = () => {
    
            if(winner.winnerMove) {
                return 'Winner: ' + winner.winnerMove;
            } else {
                return 'Next Move: ' + (this.state.isNextX ? 'X' : 'O');
            }
        }

        let status = getStatus();

        const moves = history.reverse().map((step, move) => {
            let index = history.length - 1 - move;
            const desc = index ?
              'Go to move #' + index + ` at (${step.clickedCell[0]},${step.clickedCell[1]})` :
              'Go to game start';
            return (
              <li key={index}>
                <button onClick={() => {
                    this.jumpTo(index);
                }}>{desc}</button>
              </li>
            );
          });

        return (
            <div className = "container-fluid">
                <h1 className = "bg-primary text-center text-white p-2">Welcome to Tic Tac Toe</h1>
                <div className = "bg-secondary">
                    <Board squares = {squares} winnerSquares = {winner.winnerSquares} onClick = {(row,column) => this.clickHandler(row,column)}/>
                </div>
                <div className = "bg-info bordered m-2">
                    <div className = "row m-1">{status}</div>
                    <div className = "row m-1">Last move: <strong>{lastMove}</strong></div>
                    <strong>{this.getWinnerSquaresJsx()}</strong>
                    <ol>{moves}</ol>
                </div>
                <h3>Have Nice Game!!</h3>
            </div>
        );
    }

    jumpTo(move) {

        const stepNumber = move;

        const squares = this.state.history[stepNumber].squares;
        let winnerInfo = this.getWinner(squares);
        let winnerSquares = [];
        if(winnerInfo.winnerSquares && winnerInfo.winnerSquares.length > 0) {
            winnerSquares = winnerInfo.winnerSquares;
        }

        this.setState({
            isNextX : move % 2, 
            stepNumber : stepNumber,
            winnerSquares: winnerInfo.winnerSquares
        });
    }

    clickHandler = (row,column) => {

        const sizeOfGrid = 3;
        const index = row * sizeOfGrid + column;

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];

        let squares = current.squares.slice();

        const winner = this.getWinner(squares);

        if(squares[index] || winner.winnerMove )
            return;

        squares[index] = this.state.isNextX ? 'X' : 'O';

        this.setState({
            history : history.concat([
            { 
                squares: squares,
                clickedCell : [row,column]
            }]),
             isNextX : !this.state.isNextX,
            stepNumber : history.length,
            winnerSquares : this.getWinner(squares).winnerSquares,
        });
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
                    return {
                        winnerMove: squares[x],
                        winnerSquares: [x,y,z]
                    };
        }
        return {
            winnerMove: null,
            winnerSquares: []
        };
    }
}

class Board extends React.Component {

    renderSquare(row,column) {

        const SizeOfGrid = 3;

        let i = row * SizeOfGrid + column;

        let highlight = this.props.winnerSquares.includes(i);

        return (
            <Square value = {this.props.squares[i]} highlight = {highlight} 
                onClick = {() => {this.props.onClick(row,column);}}/>
        );
    }

    render() {

        let numbers = [[0,1,2], [3,4,5], [6,7,8]];
        //let numbers = Array(3).fill(Array(3).keys());

        return (
                <div className = "container" id = 'board'>
                    {
                        numbers.map((value,index) => {
                            return (
                                <div className = "row m-1" id = {`div${index + 1}`}>
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
    <button className = "col-1 btn btn-info p-1 m-2" onClick = {props.onClick} >{boldSquare(props)}</button>
    );

    function boldSquare(props) {
        if ( props.highlight) {
            return <strong>{props.value}</strong>

        } else {
            return props.value
        }
    }
}