import React from 'react';
import PropTypes from 'prop-types';

const BoardHead = props => {
    let minutos = Math.floor(props.tiempo / 60);
    let segundos = props.tiempo - minutos * 60 || 0;

    segundos = segundos < 10 ? `0${segundos}` : segundos;

    let tiempo = `${minutos}:${segundos}`;
    let status =
        props.status === "on" || props.status === "waiting" ? ( <
            i className = "icon ion-happy-outline" / >
        ) : ( <
            i className = "icon ion-sad-outline" / >
        );
    return (
        <div className='board-head'>
            <div className='contador-banderas'>{props.ContadorBanderas} </div>
            <button className='reset'onClick={props.reset}> rest {status} </button>
            <div className='timer'>{tiempo}</div>
        </div>
    );
};

BoardHead.propTypes = {
    tiempo: PropTypes.number.isRequired,
    ContadorBanderas: PropTypes.number.isRequired,
};

export default BoardHead;