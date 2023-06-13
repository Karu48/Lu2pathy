import React from 'react';
import cuatroEnLineaImg from './images/4enlinea.jpg';
import tatetiImg from './images/tictactoe.jpg';
import minesweeper from './images/minesweeper.png';


function MenuInicio() {
  return (
    <div className="menu-inicio">
      <h1 className="titulo-pagina">LU2PATHY</h1>
      <div className="botones-juego">
        <button className="cuadrado">
          <div className="nombre-juego">4 en línea</div>
          <img className="imagen-juego" src = {cuatroEnLineaImg} alt="4 en línea" />
        </button>
        <button className="cuadrado">
          <div className="nombre-juego">Buscaminas</div>
          <img className="imagen-juego" src={minesweeper} alt="Buscaminas" />
        </button>
        <button className="cuadrado">
          <div className="nombre-juego">Tic-Tac-Toe</div>
          <img className="imagen-juego" src={tatetiImg} alt="Ta-Te-Ti" />
        </button>
      </div>
    </div>
  );
}

export default MenuInicio;