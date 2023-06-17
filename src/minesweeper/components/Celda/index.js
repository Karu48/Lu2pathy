import React from 'react';

const Celda = props => {
    let celda_renderizada = () => {
        if (props.celda.esta_abierto) {
            if (props.celda.tiene_mina) {
                return (
                    <div className='celda abierta' 
                    onClick={() => props.open(props.celda)}
                    onContextMenu={e => {
                        e.preventDefault();
                    }}
                    >
                    <span><i className='ion ion-android-radio-button-on'></i></span>
                    </div>
                );
            } else if (props.celda.contador === 0) {
                return (
                  <div
                    className="celda abierta"
                    onClick={() => props.open(props.celda)}
                    onContextMenu={e => {
                      e.preventDefault();
                      props.bandera(props.celda);
                    }}  
                  />
                );
            } else {
                return (
                  <div
                    className="celda abierta"
                    onClick={() => props.open(props.celda)}
                    onContextMenu={e => {
                      e.preventDefault();
                    }}
                  >
                    {props.celda.contador}
                  </div>
                );
              }
        } else if (props.celda.tiene_bandera) {
            return (
              <div
                className="celda bandera-abierta"
                onClick={() => props.open(props.celda)}
                onContextMenu={e => {
                  e.preventDefault();
                  props.bandera(props.celda);
                }}
              >
              <span> <i className = "icon ion-flag" > </i></span >
              </div>
            );
        } else {
            return (
              <div
                className="celda"
                onClick={() => props.open(props.celda)}
                onContextMenu={e => {
                  e.preventDefault();
                  props.bandera(props.celda);
                }}
              />
            );
        } 
    };
    return celda_renderizada();
};

export default Celda;