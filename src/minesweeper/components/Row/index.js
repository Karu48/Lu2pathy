import React from 'react';
import Celda from "../Celda";

const Fila = props => {
  let celdas = props.celdas.map((celda, index) => (
    <Celda key={index} celda={celda} open={props.open} bandera={props.bandera} />
  ));
  return <div className='fila'> {celdas} </div>;
};


export default Fila;