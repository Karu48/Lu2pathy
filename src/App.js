import './App.css';
import ConnectFour from './Connect4/Connect4';
import MenuInicio from './MenuInicio';
import {Route, Routes} from 'react-router-dom'

function App() { 
  return (
    <div className="App">
      <Routes>
        <Route path="/" element= {<MenuInicio />}></Route>
        <Route path="/Connect-4" element= {<ConnectFour />}></Route>
      </Routes>
    </div>
  );
}

export default App;
