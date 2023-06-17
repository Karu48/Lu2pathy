import React, { Component } from 'react';
import Fila from "../Row";

class Board extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filas: this.crearBoard(props)
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.celdasAbiertas > this.props.celdasAbiertas) {
            this.setState({
                filas: this.crearBoard(this.props)
            });
        }
    }

    /*
    componentWillReceiveProps(nextProps) {
      if (this.props.celdasAbiertas > nextProps.celdasAbiertas) {
        this.setState({
          filas: this.crearBoard(nextProps)
        });
      }
    }
    */

    /*
    static getDerivedStateFromProps(nextProps, prevState) {
        if (
          nextProps.celdasAbiertas > prevState.filas[0][0].celdasAbiertas ||
          nextProps.columnas !== prevState.filas[0].length
        ) {
          return {
            filas: this.crearBoard(nextProps)
          };
        }
        return null;
    }
    */

    crearBoard = props => {
        let board = [];
        for (let i = 0; i < props.filas; i++) {
            board.push([]);
            for (let j = 0; j < props.columnas; j++) {
                board[i].push({
                    x: j, //columna
                    y: i, //fila
                    contador: 0, //contador de minas
                    esta_abierto: false, //si esta abierto
                    tiene_mina: false, //si tiene bomba
                    tiene_bandera: false, //si tiene bandera
                });
            }
        }

        //luego de crear el tablero 10 * 10, agregaremos las minitas
        for (let i = 0; i < props.minas; i++) {
            let filaRandom = Math.floor(Math.random() * props.filas);
            let columnaRandom = Math.floor(Math.random() * props.columnas);

            let celda = board[filaRandom][columnaRandom];

            if (celda.tiene_mina) {
                i--;
            } else {
                celda.tiene_mina = true;
                //celda.contador = 0;
            }
        }
        return board;
    };

    bandera = (celda) => {
        if (this.props.estado === 'off') {
            return;
        }

        if (!celda.esta_abierto) {
            let filas = [...this.state.filas];

            celda.tiene_bandera = !celda.tiene_bandera;
            this.setState({ filas });
            this.props.changeFlagAmount(celda.tiene_bandera ? -1 : 1);
        }

    };

    open = (celda) => {
        if (this.props.estado === 'off') {
            return;
        }
        let asyncCountMines = new Promise((resolve) => {
            let minas = this.encontrarMinas(celda);
            resolve(minas);
        });

        asyncCountMines.then((numeroMinas) => {
            let filas = [...this.state.filas];

            let current = filas[celda.y][celda.x];

            if (current.tiene_mina && this.props.celdasAbiertas === 0) {
                //console.log('perdiste por noob V:');
                let nuevasFilas = this.crearBoard(this.props);
                this.setState({
                        filas: nuevasFilas
                    },
                    () => {
                        this.open(celda);
                    }
                );
            } else {
                if (!celda.tiene_bandera && !current.esta_abierto) {
                    this.props.celdasAbiertasClick();

                    current.esta_abierto = true;
                    current.contador = numeroMinas;

                    this.setState({ filas });

                    if (!current.tiene_mina && numeroMinas === 0) {
                        this.openAroundCell(celda);
                    }

                    if (current.tiene_mina && this.props.celdasAbiertas !== 0) {
                        this.props.endGame();
                    }
                }
            }
        });
    };

    encontrarMinas = celda => {
        let minasAdyacentes = 0;
        for (let fila = -1; fila <= 1; fila++) {
            for (let columna = -1; columna <= 1; columna++) {
                if (celda.y + fila >= 0 && celda.x + columna >= 0) {
                    if (
                        celda.y + fila < this.state.filas.length &&
                        celda.x + columna < this.state.filas[0].length
                    ) {
                        if (
                            this.state.filas[celda.y + fila][celda.x + columna].tiene_mina &&
                            !(fila === 0 && columna === 0)
                        ) {
                            minasAdyacentes++;
                        }
                    }
                }
            }
        }

        return minasAdyacentes;
    };

    openAroundCell = (celda) => {
        let filas = [...this.state.filas];

        for (let fila = -1; fila <= 1; fila++) {
            for (let columna = -1; columna <= 1; columna++) {
                if (celda.y + fila >= 0 && celda.x + columna >= 0) {
                    if (
                        celda.y + fila < filas.length &&
                        celda.x + columna < filas[0].length
                    ) {
                        if (!filas[celda.y + fila][celda.x + columna].tiene_mina &&
                            !filas[celda.y + fila][celda.x + columna].esta_abierto
                        ) {
                            this.open(filas[celda.y + fila][celda.x + columna]);
                        }
                    }
                }
            }
        }
    };

    render() {
        let filas = this.state.filas.map((celdas, index) => (
            <Fila
                celdas={celdas}
                open={this.open}            
                bandera={this.bandera}
                key={index}
            /> 
        )); 
    return <div className='board'>{filas} </div>;
    }
}

export default Board;