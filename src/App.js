import './App.css';
import MenuInicio from './MenuInicio';
import {Route, Routes} from 'react-router-dom'
import { Connect4 } from './connect_4/C4';

function App() { 
  return (
    <div className="App">
      <Routes>
        <Route path="/" element= {<MenuInicio />}></Route>
        <Route path="/Connect-4" element= {<Connect4 />}></Route>
      </Routes>
    </div>
  );
}

export default App;
