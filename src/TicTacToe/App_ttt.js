import React from "react";
import { useState } from 'react';
import "./styles.css";

function Square({value, onSquareClick}){
    return (<button className="square" onClick={onSquareClick}>{value}</button>);
}

export default function TTT(){
    const [xIsNext, setXIsNext] = useState(false);
    const [squares, setSquares] = useState(Array(9).fill(null));

    function Click(i){
        if (squares[i] || calculateWinner(squares)){
            return;
        }

        if (xIsNext) {
            squares[i] = "X";
          } else {
            squares[i] = "O";
          }
          setSquares(squares);
          setXIsNext(!xIsNext);
        }

        const winner = calculateWinner(squares);
        let status;
        if (winner){
            status= "Winner: " + winner;
        } else {
            status = "Next player: " + (xIsNext ? "X" : "O")
        }

    function restart(){
        window.location.reload(false);
    }
    
    const [leaderboard, setLeaderboard] = useState([]);

    function fetchLeaderboards(){
        const headers = { 'Content-Type' : 'application/json'}
        fetch('http://127.0.0.1:5000/TicTacToe')
            .then(response => response.json())
            .then(data=> setLeaderboard(data));
    }

    fetchLeaderboards();

    return (
        <>
            <div className="Row">
                <Square value = {squares[0]} onSquareClick={() => Click(0)} />
                <Square value = {squares[1]} onSquareClick={() => Click(1)} />
                <Square value = {squares[2]} onSquareClick={() => Click(2)} />
            </div>
            <div className="Row">
                <Square value = {squares[3]} onSquareClick={() => Click(3)}/>
                <Square value = {squares[4]} onSquareClick={() => Click(4)}/>
                <Square value = {squares[5]} onSquareClick={() => Click(5)}/>
            </div>
            <div className="Row">
                <Square value = {squares[6]} onSquareClick={() => Click(6)}/>
                <Square value = {squares[7]} onSquareClick={() => Click(7)}/>
                <Square value = {squares[8]} onSquareClick={() => Click(8)}/>
            </div>
            <div className="Status">{status}</div>
            <div className="Restart"><button className="restart" onClick={restart}>Play again</button></div>
            <div className="Leaderboard">
                <table>
                    <thead>
                        <th>ID</th>
                        <th>Player 1</th>
                        <th>Player 2</th>
                        <th>Winner</th>
                    </thead>
                    <tbody>
                        
                    </tbody>
                </table>
            </div>

            <div className='LoginSignup'>
                <div className='Username'>
                    Username
                </div>
                <input type='text'></input>
                <div className='Password'>
                    Password
                </div>
                <input type='password'></input>
                <br></br>
                <button className='Login'>Login</button>
                <button className='Signup'>Signup</button>
            </div>

            <div className='LoginSignup2'>
                <div className='Username 2'>
                    Username
                </div>
                <input type='text'></input>
                <div className='Password 2'>
                    Password
                </div>
                <input type='password'></input>
                <br></br>
                <button className='Login'>Login</button>
                <button className='Signup'>Signup</button>
            </div>
        </>
    )
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
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }