import React, { Component } from 'react';
import BoardHead from './components/BoardHead';
import Board from "./components/Board";
import './index.css';
import "./styles/base.css"

class Minesweeper extends Component {
    constructor() {
        super();

        this.state = {
            estado: 'waiting', // waiting, on, off  
            tiempo: 0,
            banderas: 10,
            celdasAbiertas: 0,
            minas: 10,
            filas: 10,
            columnas: 10
        };

        this.baseState = this.state;
        this.leaderboard = [];

        this.displayData = this.leaderboard.map(
            (info)=>{
                return(
                    <tr>
                        <td>{info.id}</td>
                        <td>{info.player_username}</td>
                        <td>{info.time}</td>
                    </tr>
                )   
            }
        )
    }

    componentDidMount() {
        this.intervals = [];
    }


    componentDidUpdate(nextProps, nextState) {
        if (this.state.estado === "on") {
            this.CheckGanador();
        }
    }

    CheckGanador = () => {
        if (this.state.minas + this.state.celdasAbiertas >= this.state.filas * this.state.columnas) {
            this.setState({
                estado: "winner"
            }, alert("ganaste papu V:!"))
        }
    }

    componentWillUnmount() {
        this.intervals.forEach(clearInterval);
    }

    setInterval = (fn, t) => {
        this.intervals.push(setInterval(fn, t));
    }

    reset = () => {
        this.intervals.map(clearInterval);
        this.setState(Object.assign({}, this.baseState), () => {
            this.intervals = [];
        });
    };

    tick = () => {
        if (this.state.celdasAbiertas > 0 && this.state.estado === 'on') {
            let tiempo = this.state.tiempo + 1;
            this.setState({ tiempo });
        }
    };

    endGame = () => {
        this.setState({
            estado: "off"
        });
    };

    changeFlagAmount = (amount) => {
        this.setState({ banderas: this.state.banderas + amount });
    };

    celdasHandleClick = () => {
        if (this.state.celdasAbiertas === 0 && this.state.estado !== 'on') {
            this.setState({
                    estado: 'on'
                },
                this.setInterval(this.tick, 1000)
            );
        }
        this.setState(prevState => {
            return { celdasAbiertas: prevState.celdasAbiertas + 1 };
        });
    };
    
    fetchLeaderboards(){
    fetch('http://127.0.0.1:5000/Minesweeper')
        .then(response => response.json())
        .then(data=> this.leaderboard = data);
  }

    

    render() {
        return (
          <div className='minesweeper'>
          <h1>Minesweeper Chess pes V:</h1>
            <BoardHead 
              tiempo = {this.state.tiempo} 
              ContadorBanderas = {this.state.banderas} 
              reset={this.reset} 
              status={this.state.estado} 
              />
            <Board 
              celdasAbiertas={this.state.celdasAbiertas}
              filas={this.state.filas} 
              columnas={this.state.columnas} 
              minas={this.state.minas} 
              estado={this.state.estado} 
              endGame={this.endGame}
              celdasAbiertasClick={this.celdasHandleClick }
              changeFlagAmount={this.changeFlagAmount} />

            <div className="Leaderboard">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Player 1</th>
                            <th>Player 2</th>
                            <th>Winner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.displayData}
                    </tbody>
                </table>
            </div>

            <div className='LoginSignup'>
                <div className='Username'>
                    Username
                </div>
                <input type='text'></input>
                <div className='Password'>
                    Password
                </div>
                <input type='password'></input>
                <br></br>
                <button className='Login'>Login</button>
                <button className='Signup'>Signup</button>
            </div>
          </div>
        );
    }
}

export default Minesweeper;