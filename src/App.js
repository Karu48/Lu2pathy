import './App.css';
import MenuInicio from './MenuInicio';
import {Route, Routes} from 'react-router-dom'
import App_MS from './Minesweeper/src/App_MS';
import TTT from './TicTacToe/App_ttt';
import ConnectFour from './Connect4/ConnectFour';


function App() { 
  return (
    <div className="App">
      <Routes>
        <Route path="/" element= {<MenuInicio />}></Route>
        <Route path="/Connect-4" element= {<ConnectFour />}></Route>
        <Route path="/Tic-Tac-Toe" element= {<TTT />}></Route>
        <Route path="/Minesweeper" element={<App_MS />}></Route>
      </Routes>
    </div>
  );
}

export default App;
