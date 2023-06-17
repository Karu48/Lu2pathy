import React from 'react';
import { createRoot } from 'react-dom/client';
//import { render } from 'react-dom';
import './index.css';
import "./styles/base.css"
import Minesweeper from './minesweeper/Minesweeper';

createRoot(document.getElementById("root")).render(<Minesweeper/>);