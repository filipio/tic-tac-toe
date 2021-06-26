import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const ROWS = 3;
const NO_MOVE = -1;

function Square(props){
  console.log("Square function was called.");
  return (
    <button className="square" onClick={props.squareClicked}>
      {props.value}
    </button>
  );
}

  
  class Board extends React.Component {

    renderSquare(i) {
      return (
        <Square
          value={this.props.squares[i]}
          squareClicked={() => this.props.squareClicked(i)}
        />
      );
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        history : [{
          squares : Array(9).fill(null),
          move : {
            row : NO_MOVE,
            column : NO_MOVE
          }
        }],
        isXNext : true,
        stepNumber : 0,
      };
    }

    handleClick(i){
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if(calculateWinner(squares) || squares[i]){
        return;
      }
      const row = Math.floor(i / ROWS);
      const column = i % ROWS;
      squares[i] = this.state.isXNext ? 'X' : 'O';
      this.setState({
        history : history.concat([{
          squares : squares,
          move : {
            row : row,
            column : column
          }
      }]),
      isXNext : !this.state.isXNext,
        stepNumber : history.length});
    }

    jumpTo(step){
      console.log("jumpTo was called.");
      this.setState({
        stepNumber : step,
        isXNext : (step % 2) === 0,
      });
    }

    render() {
      console.log("render was called.");
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const moves = history.map((el, step) => {
        const stepDesc = step ? 'Go to move #' + step : 'Go to game start';
        const moveDesc = step ? `(${el.move.row}, ${el.move.column})` : '';
        return (
          <li key={step}>
            <button onClick={() => this.jumpTo(step)}>{stepDesc} {moveDesc}</button>
          </li>
        )
      })
      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.isXNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board squareClicked = {(i) => this.handleClick(i)} squares = {current.squares} />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  