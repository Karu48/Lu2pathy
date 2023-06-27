import React, { useRef } from "react";
import { useState, useEffect } from 'react';
import "./styles.css";

function Square({value, onSquareClick}){
    return (<button className="square" onClick={onSquareClick}>{value}</button>);
}

export default function TTT(){
    const [xIsNext, setXIsNext] = useState(false);
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [p1logged, setP1logged] = useState(false);
    const [p2logged, setP2logged] = useState(false);
    const [player1, setPlayer1] = useState(null);
    const [player2, setPlayer2] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const refU1 = useRef(null);
    const refP1 = useRef(null);
    const refU2 = useRef(null);
    const refP2 = useRef(null);

    function postWinner(winner_player) {
        console.log(player1);
        console.log(player2);
        console.log(winner_player);
        fetch('http://127.0.0.1:5000/TicTacToe', {
            method: 'POST',
            body: JSON.stringify({
                player1_username: player1,
                player2_username: player2,
                winner: winner_player
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
        .then(data => console.log(data));
    }

    function Click(i){
        if (squares[i] || calculateWinner(squares) || !p1logged || !p2logged){
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

        var winner = calculateWinner(squares);
        let status;
        if (!p1logged || !p2logged){
            status = "Awaiting for players to login...";
        } else if (winner){
            status = "Winner: " + winner;
        } else {
            status = "Next player: " + (xIsNext ? "X" : "O")
        }

        
    function restart(){
        window.location.reload(false);
    }

    function fetchLeaderboards(){
        fetch('http://127.0.0.1:5000/TicTacToe')
            .then(response => response.json())
            .then(data=> setLeaderboard(data));
    }


    const displayData = leaderboard.map(
        (info)=>{
            return(
                <tr>
                    <td>{info.id}</td>
                    <td>{info.player1_username}</td>
                    <td>{info.player2_username}</td>
                    <td>{info.winner}</td>
                </tr>
            )
        }
    )

    const login1 = () => {
        setPlayer1(refU1.current.value);
        fetch('http://127.0.0.1:5000/players', {
            method: 'PUT',
            body: JSON.stringify({
                username: refU1.current.value,
                password: refP1.current.value
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
        .then(data => data.json())
        .then((data) => {
            if (data['response'] === 'SUCCESS'){
                setP1logged(true);
            }
        })
    }

    const login2 = () => {
        setPlayer2(refU2.current.value);
        fetch('http://127.0.0.1:5000/players', {
            method: 'PUT',
            body: JSON.stringify({
                username: refU2.current.value,
                password: refP2.current.value
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
        .then(data => data.json())
        .then((data) => {
            if (data['response'] === 'SUCCESS'){
                setP2logged(true);
            }
        })
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
            if (squares[a] === 'O'){
                postWinner(player1);
            } else {
                postWinner(player2);
            }
            return squares[a];
          }
        }
        return null;
      }

    useEffect(() => {
        fetchLeaderboards();
    }, []);

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
            <br></br>
            <br></br>
            <div className="Leaderboard">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Player 1</th>
                            <th>Player 2</th>
                            <th>Winner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayData}
                    </tbody>
                </table>
            </div>

            <div className='LoginSignup'>
                <div className='Username'>
                    Username
                </div>
                <input type='text' ref={refU1}></input>
                <div className='Password'>
                    Password
                </div>
                <input type='password' ref={refP1}></input>
                <br></br>
                <button className='Login' onClick={login1}>Login</button>
                <button className='Signup'>Signup</button>
            </div>

            <div className='LoginSignup2'>
                <div className='Username 2'>
                    Username
                </div>
                <input type='text' ref={refU2}></input>
                <div className='Password 2'>
                    Password
                </div>
                <input type='password' ref={refP2}></input>
                <br></br>
                <button className='Login' onClick={login2}>Login</button>
                <button className='Signup'>Signup</button>
            </div>
        </>
    )
}