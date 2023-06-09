import React from 'react';
import tatetiImg from './images/tictactoe.jpg';
import minesweeperIMG from './images/minesweeper.png';
import connect4IMG from './images/connect4.jpeg';


function MenuInicio() {
  return (
    <div className="menu-inicio">
      <h1 className="titulo-pagina">LU2PATHY</h1>
      <div className="botones-juego">
        <a href="/Connect-4">
          <button className="cuadrado">
            <div className="nombre-juego">4 en línea</div>
            <img className="imagen-juego" src = {connect4IMG} alt="4 en línea" />
          </button>
        </a>
        <a href="/Minesweeper">
          <button className="cuadrado">
            <div className="nombre-juego">Buscaminas</div>
            <img className="imagen-juego" src={minesweeperIMG} alt="Buscaminas" />
          </button>
          </a>
        <a href="/Tic-Tac-Toe">
          <button className="cuadrado">
            <div className="nombre-juego">Tic-Tac-Toe</div>
            <img className="imagen-juego" src={tatetiImg} alt="Tic-Tac-Toe" />
          </button>
        </a>
      </div>
    </div>
  );
}

export default MenuInicio;