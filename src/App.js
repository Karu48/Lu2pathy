import './App.css';
import MenuInicio from './MenuInicio';
import {Route, Routes} from 'react-router-dom'
import Minesweeper from './minesweeper/Minesweeper';
import TTT from './TicTacToe/App_ttt';
import ConnectFour from './Connect4/ConnectFour';


function App() { 
  return (
    <div className="App">
      <Routes>
        <Route path="/" element= {<MenuInicio />}></Route>
        <Route path="/Connect-4" element= {<ConnectFour />}></Route>
        <Route path="/Tic-Tac-Toe" element= {<TTT />}></Route>
        <Route path="/Minesweeper" element={<Minesweeper />}></Route>
      </Routes>
    </div>
  );
}

export default App;