import React, { useRef } from "react";
import { useState, useEffect } from 'react';
import "./styles.css";

function Square({value, onSquareClick}){
    return (<button className="square" onClick={onSquareClick}>{value}</button>);
}

export default function TTT(){
    const [xIsNext, setXIsNext] = useState(false);
    const [squares, setSquares] = useState(Array(9).fill(null));
    const [p1logged, setP1logged] = useState('waiting');
    const [p2logged, setP2logged] = useState('waiting');
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
        if (squares[i] || calculateWinner(squares) || p1logged !== 'success' || p2logged !== 'success'){
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
    if ( p1logged !== 'success' || p2logged !== 'success'){
        status = "Awaiting for players to login...";
    } else if (winner){
        status = "Winner: " + (winner === "O" ? player1 : player2);
    } else {
        status = (xIsNext ? player2 : player1) + "'s turn";
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

    function signUp(type, player){
        var user;
        var pw;
        var met;

        if (type === 'signup'){
            met = 'POST';
        } else if (type === 'login') {
            met = 'PUT';
        }

        if (player === 1){
            user = refU1.current.value;
            setPlayer1(user);
            pw = refP1.current.value;
        } else if (player === 2){
            user = refU2.current.value;
            setPlayer2(user);
            pw = refP2.current.value;
        }

        fetch('http://127.0.0.1:5000/players', {
            method: met,
            body: JSON.stringify({
                username: user,
                password: pw
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        })
        .then(data => data.json())
        .then((data) => {
            if (data['response'] === 'SUCCESS'){
                if (player === 1){
                    setP1logged('success');
                } else if (player === 2){
                    setP2logged('success');
                }
            } else {
                if (player === 1){
                    setP1logged('error');
                } else if (player === 2){
                    setP2logged('error');
                }
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

    let p1status = "Awaiting login...";
    if (p1logged === 'success'){
        p1status = "Logged in successfully";
    } else if (p1logged === 'error'){
        p1status = "Autentication failed";
    }

    let p2status = "Awaiting login...";
    if (p2logged === 'success'){
        p2status = "Logged in successfully";
    } else if (p2logged === 'error'){
        p2status = "Autentication failed";
    }

    useEffect(() => {
        fetchLeaderboards();
    }, []);

    return (
        <>
            <div className="game">
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
            </div>
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
                <button className='Login' onClick={() => signUp('login', 1)}>Login</button>
                <button className='Signup' onClick={() => signUp('signup', 1)}>Signup</button>
                <div className="p1status">
                    { p1status }
                </div>
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
                <button className='Login' onClick={() => signUp('login', 2)}>Login</button>
                <button className='Signup' onClick={() => signUp('signup', 2)}>Signup</button>
                <div className="p2status">
                    { p2status }
                </div>
            </div>
        </>
    )
}