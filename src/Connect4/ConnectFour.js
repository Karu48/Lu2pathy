import React, { useState, useEffect, useRef } from "react";
import "./styles.css";

const boardSettings = {
  rows: 6,
  columns: 9,
  dropAnimationRate: 10,
  flashAnimationRate: 600,
  colors: {
    empty: "#AAAAAA",
    p1: "#BB2222",
    p2: "#2222BB"
  }
};

const winTypes = {
  vertical: 0,
  horizontal: 1,
  forwardsDiagonal: 2,
  backwardsDiagonal: 3
};

export default function ConnectFour() {
    const [board, setBoard] = useState(createBoard());
    const [currentPlayer, setCurrentPlayer] = useState(getFirstPlayerTurn());
    const [win, setWin] = useState(null);
    const [flashTimer, setFlashTimer] = useState(null);
    const [dropping, setDropping] = useState(false);
    const domBoard = useRef(null);
    const refU1 = useRef(null);
    const refP1 = useRef(null);
    const refU2 = useRef(null);
    const refP2 = useRef(null);
    const [p1logged, setP1logged] = useState('waiting');
    const [p2logged, setP2logged] = useState('waiting');
    const [player1, setPlayer1] = useState(null);
    const [player2, setPlayer2] = useState(null);

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


    /**
     * Helper function to get the index in the board using row and column.
     * @param {number} row - row in board
     * @param {number} column - column in board
     */
    function getIndex(row, column) {
      const index = row * boardSettings.columns + column;
      if (index > boardSettings.rows * boardSettings.colums) return null;
      return index;
    }
    function getRowAndColumn(index) {
      if (index > boardSettings.rows * boardSettings.colums) return null;
      const row = Math.floor(index / boardSettings.columns);
      const column = Math.floor(index % boardSettings.columns);
      return {
        row,
        column
      };
    }

    function createBoard() {
      return new Array(boardSettings.rows * boardSettings.columns).fill(
        boardSettings.colors.empty
      );
    }

    function getFirstPlayerTurn() {
      return boardSettings.colors.p1;
    }

    function restartGame() {
      setCurrentPlayer(getFirstPlayerTurn());
      setWin(null);
      setBoard(createBoard());
    }

    function getDomBoardCell(index) {
      if (!domBoard.current) return;
      const board = domBoard.current;
      const blocks = board.querySelectorAll(".board-block");
      return blocks[index];
    }

    function findFirstEmptyRow(column) {
      let { empty } = boardSettings.colors;
      let { rows } = boardSettings;
      for (let i = 0; i < rows; i++) {
        if (board[getIndex(i, column)] !== empty) {
          return i - 1;
        }
      }
      return rows - 1;
    }

    async function handleDrop(column) {
      if (dropping || win || p1logged !== 'success' || p2logged !== 'success') return;
      const row = findFirstEmptyRow(column);
      if (row < 0) return;
      setDropping(true);
      await animateDrop(row, column, currentPlayer);
      setDropping(false);
      const newBoard = board.slice();
      newBoard[getIndex(row, column)] = currentPlayer;
      setBoard(newBoard);

      setCurrentPlayer(
        currentPlayer === boardSettings.colors.p1
          ? boardSettings.colors.p2
          : boardSettings.colors.p1
      );
    }

    async function animateDrop(row, column, color, currentRow) {
      if (currentRow === undefined) {
        currentRow = 0;
      }
      return new Promise(resolve => {
        if (currentRow > row) {
          return resolve();
        }
        if (currentRow > 0) {
          let c = getDomBoardCell(getIndex(currentRow - 1, column));
          c.style.backgroundColor = boardSettings.colors.empty;
        }
        let c = getDomBoardCell(getIndex(currentRow, column));
        c.style.backgroundColor = color;
        setTimeout(
          () => resolve(animateDrop(row, column, color, ++currentRow)),
          boardSettings.dropAnimationRate
        );
      });
    }

    /**
     * End game animation.
     */
    useEffect(() => {
      if (!win) {
        return;
      }

      function flashWinningCells(on) {
        const { empty } = boardSettings.colors;
        const { winner } = win;
        for (let o of win.winningCells) {
          let c = getDomBoardCell(getIndex(o.row, o.column));
          c.style.backgroundColor = on ? winner : empty;
        }
        setFlashTimer(
          setTimeout(
            () => flashWinningCells(!on),
            boardSettings.flashAnimationRate
          )
        );
      }

      flashWinningCells(false);
    }, [win, setFlashTimer]);

    /**
     * Clears the end game animation timeout when game is restarted.
     */
    useEffect(() => {
      if (!win) {
        if (flashTimer) clearTimeout(flashTimer);
      }
    }, [win, flashTimer]);

    /**
     * Check for win when the board changes.
     */
    useEffect(() => {
      if (dropping || win) return;

      function isWin() {
        return (
          isForwardsDiagonalWin() ||
          isBackwardsDiagonalWin() ||
          isHorizontalWin() ||
          isVerticalWin() ||
          null
        );
      }

      function createWinState(start, winType) {
        const win = {
          winner: board[start],
          winningCells: []
        };

        let pos = getRowAndColumn(start);

        while (true) {
          let current = board[getIndex(pos.row, pos.column)];
          if (current === win.winner) {
            win.winningCells.push({ ...pos });
            if (winType === winTypes.horizontal) {
              pos.column++;
            } else if (winType === winTypes.vertical) {
              pos.row++;
            } else if (winType === winTypes.backwardsDiagonal) {
              pos.row++;
              pos.column++;
            } else if (winType === winTypes.forwardsDiagonal) {
              pos.row++;
              pos.column--;
            }
          } else {
            return win;
          }
        }
      }
      function isHorizontalWin() {
        const { rows } = boardSettings;
        const { columns } = boardSettings;
        const { empty } = boardSettings.colors;
        for (let row = 0; row < rows; row++) {
          for (let column = 0; column <= columns - 4; column++) {
            let start = getIndex(row, column);
            if (board[start] === empty) continue;
            let counter = 1;
            for (let k = column + 1; k < column + 4; k++) {
              if (board[getIndex(row, k)] === board[start]) {
                counter++;
                if (counter === 4)
                  return createWinState(start, winTypes.horizontal);
              }
            }
          }
        }
      }
      function isVerticalWin() {
        const { rows } = boardSettings;
        const { columns } = boardSettings;
        const { empty } = boardSettings.colors;
        for (let column = 0; column < columns; column++) {
          for (let row = 0; row <= rows - 4; row++) {
            let start = getIndex(row, column);
            if (board[start] === empty) continue;
            let counter = 1;
            for (let k = row + 1; k < row + 4; k++) {
              if (board[getIndex(k, column)] === board[start]) {
                counter++;
                if (counter === 4)
                  return createWinState(start, winTypes.vertical);
              }
            }
          }
        }
      }
      function isBackwardsDiagonalWin() {
        const { rows } = boardSettings;
        const { columns } = boardSettings;
        const { empty } = boardSettings.colors;
        for (let row = 0; row <= rows - 4; row++) {
          for (let column = 0; column <= columns - 4; column++) {
            let start = getIndex(row, column);
            if (board[start] === empty) continue;
            let counter = 1;
            for (let i = 1; i < 4; i++) {
              if (board[getIndex(row + i, column + i)] === board[start]) {
                counter++;
                if (counter === 4)
                  return createWinState(start, winTypes.backwardsDiagonal);
              }
            }
          }
        }
      }
      function isForwardsDiagonalWin() {
        const { rows } = boardSettings;
        const { columns } = boardSettings;
        const { empty } = boardSettings.colors;
        for (let row = 0; row <= rows - 4; row++) {
          for (let column = 3; column <= columns; column++) {
            let start = getIndex(row, column);
            if (board[start] === empty) continue;
            let counter = 1;
            for (let i = 1; i < 4; i++) {
              if (board[getIndex(row + i, column - i)] === board[start]) {
                counter++;
                if (counter === 4)
                  return createWinState(start, winTypes.forwardsDiagonal);
              }
            }
          }
        }
      }
      setWin(isWin());
    }, [board, dropping, win]);

    function createDropButtons() {
      const btns = [];
      for (let i = 0; i < boardSettings.columns; i++) {
        btns.push(
          <button
            key={i}
            className="cell drop-button"
            onClick={() => handleDrop(i)}
            style={{
              backgroundColor: currentPlayer
            }}
          />
        );
      }
      return btns;
    }

    const cells = board.map((c, i) => (
      <button
        key={"c" + i}
        className="cell board-block"
        style={{
          backgroundColor: c
        }}
      />
    ));

    function getGridTemplateColumns() {
      let gridTemplateColumns = "";
      for (let i = 0; i < boardSettings.columns; i++) {
        gridTemplateColumns += "auto ";
      }
      return gridTemplateColumns;
    }

    const [leaderboard, setLeaderboard] = useState([]);

    function fetchLeaderboards(){
    fetch('http://127.0.0.1:5000/Connect4?_limit=10')
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

useEffect(() => {
    fetchLeaderboards();
}, []);
  
  useEffect(() => {
    function postWinner(winner_player) {
      console.log(player1);
      console.log(player2);
      console.log(winner_player);
      fetch('http://127.0.0.1:5000/Connect4', {
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
    if (win){
      if (win.winner === boardSettings.colors.p1){
        postWinner(player1);
      } else {
        postWinner(player2);
      }
    }
  }, [win, player1, player2]);

  return (
    <>
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
      <div
        className={`board ${
          currentPlayer === boardSettings.colors.p1 ? "p1-turn" : "p2-turn"
        } `}
        ref={domBoard}
        style={{
          gridTemplateColumns: getGridTemplateColumns()
        }}
      >
        {createDropButtons()}
        {cells}
      </div>
      {!win && (
        <h2 style={{ color: currentPlayer }}>
          {currentPlayer === boardSettings.colors.p1 ? player1 : player2}
        </h2>
      )}
      {win && (
        <>
          <h1 style={{ color: win.winner }}>
            {" "}
            {win.winner === boardSettings.colors.p1
              ? player1
              : player2}{" "}
            won!
          </h1>
          <button onClick={restartGame}>Play Again</button>
          <br />
          <br />
        </>
      )}
      <br />
      <br />
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
    </>
  );
}
