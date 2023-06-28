from dataclasses import dataclass
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from flask_cors import CORS

app = Flask(__name__)

cache = {}

CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
 
db = SQLAlchemy(app)

@dataclass
class Player(db.Model):

    username = db.Column(db.String(100), primary_key = True)
    password = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<Player {self.username}>'

@dataclass
class TwoPlayerGame(db.Model):

    id = db.Column(db.Integer, primary_key = True)
    player1_username = db.Column(db.String(100), ForeignKey('player.username'))
    player2_username = db.Column(db.String(100), ForeignKey('player.username'))
    winner = db.Column(db.String(100), ForeignKey('player.username'))
    game = db.Column(db.String(100), nullable = False)

    def __repr__(self):
        return f'<TwoPlayerGame {self.id}>'

@dataclass
class Buscaminas(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    player_username = db.Column(db.String(100), ForeignKey('player.username'))
    time = db.Column(db.Integer, nullable=False)

with app.app_context():
    db.create_all()

@app.route('/players', methods = ['GET', 'POST', 'PUT', 'DELETE'])
def route_players():
    if request.method == 'GET':
        if 'players' in cache:
            return cache['players']
        else:
            players = Player.query.all()
            player_list = [{'username' : player.username} for player in players]
            cache['players'] = player_list
            return jsonify(player_list)
    elif request.method == 'POST':
        player_data = request.get_json()
        new_player = Player(username = player_data['username'], password = player_data['password'])
        try:
            db.session.add(new_player)
            db.session.commit()
        except:
            return jsonify({'response':'ERROR'})
        del cache['players']
        return jsonify({'response':'SUCCESS'})
    elif request.method == 'PUT':
        player_data = request.get_json()
        player = Player.query.filter_by(username = player_data['username']).first()
        if (player == None):
            return jsonify({'response':'ERROR'})
        if (player.password == player_data['password']):
            return jsonify({'response':'SUCCESS'})
        return jsonify({'response':'ERROR'})
    elif request.method == 'DELETE':
        player_data = request.get_json()
        player = Player.query.filter_by(username = player_data['username']).first()
        if player.password == player_data['password']:
            db.session.delete(player)
            db.session.commit()
            del cache['players']
            return 'SUCCESS'
        else:
            return 'ERROR'

@app.route('/minesweeper', methods = ['GET', 'POST', 'DELETE'])
def route_minesweeper():
    if request.method == 'GET':
        if 'minesweeper' in cache:
            return cache['minesweeper']
        else:
            games = Buscaminas.query.all()
            game_list = [{'id': game.id, 'player_username': game.player_username, 'time': game.time} for game in games]
            cache['minesweeper'] = game_list
            return jsonify(game_list)
    
    elif request.method == 'POST':
        game_data = request.get_json()
        new_game = Buscaminas(player_username = game_data['player_username'], time = game_data['time'])
        try:
            db.session.add(new_game)
            db.session.commit()
        except:
            return 'ERROR'
        del cache['minesweeper']
        return 'SUCCESS'

    elif request.method == 'DELETE':
        game_data = request.get_json()
        game = Buscaminas.query.get(game_data['id'])
        db.session.delete(game)
        db.session.commit()
        del cache['minesweeper']
        return 'SUCCESS'

@app.route('/Connect4', methods = ['GET', 'POST'])
def route_connect4():
    if request.method == 'GET':
        if 'connect4' in cache:
            return cache['connect4']
        else:
            games = TwoPlayerGame.query.filter_by(game = 'C4')
            game_list = [{'id': game.id, 'player1_username': game.player1_username, 'player2_username': game.player2_username, 'winner': game.winner} for game in games]
            cache['connect4'] = game_list
            return jsonify(game_list)
    
    elif request.method == 'POST':
        game_data = request.get_json()
        new_game = TwoPlayerGame(player1_username = game_data['player1_username'], player2_username = game_data['player2_username'], winner = game_data['winner'], game = 'C4')
        try:
            db.session.add(new_game)
            db.session.commit()
        except:
            return 'ERROR'
        del cache['connect4']
        return 'SUCCESS'

@app.route('/TicTacToe', methods = ['GET', 'POST', 'DELETE'])
def route_TicTacToe():
    if request.method == 'GET':
        if 'tictactoe' in cache:
            return cache['tictactoe']
        else:
            games = TwoPlayerGame.query.filter_by(game = 'TTT')
            game_list = [{'id': game.id, 'player1_username': game.player1_username, 'player2_username': game.player2_username, 'winner': game.winner} for game in games]
            cache['tictactoe'] = game_list
            return jsonify(game_list)
    
    elif request.method == 'POST':
        game_data = request.get_json()
        new_game = TwoPlayerGame(player1_username = game_data['player1_username'], player2_username = game_data['player2_username'], winner = game_data['winner'], game = 'TTT')
        try:
            db.session.add(new_game)
            db.session.commit()
        except:
            return 'ERROR'
        del cache['tictactoe']
        return 'SUCCESS'

@app.route('/players_mobile', methods = ['GET'])
def route_players_mobile():
    if 'players' in cache:
        return jsonify({"players": cache['players']})
    else:
        players = Player.query.all()
        player_list = [{'username': player.username} for player in players]
        response = {'players': player_list}
        cache['players'] = player_list
        return jsonify(response)

@app.route('/minesweeper_mobile', methods = ['GET'])
def route_minesweeper_mobile():
    if 'minesweeper' in cache:
        return jsonify({'leaderboard': cache['minesweeper']})
    else: 
        games = Buscaminas.query.order_by(Buscaminas.time).all()
        game_list = [{'id': game.id, 'player_username': game.player_username, 'time': game.time} for game in games]
        response = {'leaderboard': game_list}
        cache['minesweeper'] = game_list
        return jsonify(response)

@app.route('/Connect4_mobile', methods = ['GET'])
def route_connect4_mobile():
    if 'connect4' in cache:
        return jsonify({'winners': cache['connect4']})
    else:
        games = TwoPlayerGame.query.filter_by(game = 'C4')
        game_list = [{'id': game.id, 'player1_username': game.player1_username, 'player2_username': game.player2_username, 'winner': game.winner} for game in games]
        response = {'winners': game_list}
        cache['connect4'] = game_list
        return jsonify(response)

@app.route('/TicTacToe_mobile', methods = ['GET'])
def route_tictactoe_mobile():
    if 'tictactoe' in cache:
        return jsonify({'winners': cache['tictactoe']})
    else:
        games = TwoPlayerGame.query.filter_by(game = 'TTT')
        game_list = [{'id': game.id, 'player1_username': game.player1_username, 'player2_username': game.player2_username, 'winner': game.winner} for game in games]
        response = {'winners': game_list}
        cache['tictactoe'] = game_list
        return jsonify(response)

@app.route('/2pgames', methods = ['DELETE'])
def route_2pgames():
    game_data = request.get_json()
    game = TwoPlayerGame.query.get(game_data['id'])
    db.session.delete(game)
    db.session.commit()
    del cache['connect4']
    del cache['tictactoe']
    return 'SUCCESS'

if __name__ == '__main__':
    app.run(host="0.0.0.0")