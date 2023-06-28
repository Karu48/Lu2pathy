from dataclasses import dataclass
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
 
db = SQLAlchemy(app)

@dataclass
class Player(db.Model):

    username = db.Column(db.String(100), primary_key = True)
    email = db.Column(db.String(100), nullable=False, unique = True)
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

@app.route('/players', methods = ['GET', 'POST', 'PUT'])
def route_players():
    if request.method == 'GET':
        players = Player.query.all()
        player_list = [{'username' : player.username, 'email' : player.email} for player in players]
        return jsonify(player_list)
    elif request.method == 'POST':
        player_data = request.get_json()
        new_player = Player(username = player_data['username'], email = player_data['email'], password = player_data['password'])
        try:
            db.session.add(new_player)
            db.session.commit()
        except:
            return 'ERROR'
        return 'SUCCESS'
    elif request.method == 'PUT':
        player_data = request.get_json()
        player = Player.query.filter_by(username = player_data['username']).first()
        if (player == None):
            return jsonify({'response':'ERROR'})
        if (player.password == player_data['password']):
            return jsonify({'response':'SUCCESS'})
        return jsonify({'response':'ERROR'})

@app.route('/minesweeper', methods = ['GET', 'POST'])
def route_minesweeper():
    if request.method == 'GET':
        games = Buscaminas.query.all()
        game_list = [{'id': game.id, 'player_username': game.player_username, 'time': game.time} for game in games]
        return jsonify(game_list)
    
    elif request.method == 'POST':
        game_data = request.get_json()
        new_game = Buscaminas(player_username = game_data['player_username'], time = game_data['time'])
        try:
            db.session.add(new_game)
            db.session.commit()
        except:
            return 'ERROR'
        return 'SUCCESS'

@app.route('/Connect4', methods = ['GET', 'POST'])
def route_connect4():
    if request.method == 'GET':
        games = TwoPlayerGame.query.filter_by(game = 'C4')
        game_list = [{'id': game.id, 'player1_username': game.player1_username, 'player2_username': game.player2_username, 'winner': game.winner} for game in games]
        return jsonify(game_list)
    
    elif request.method == 'POST':
        game_data = request.get_json()
        new_game = TwoPlayerGame(player1_username = game_data['player1_username'], player2_username = game_data['player2_username'], winner = game_data['winner'], game = 'C4')
        try:
            db.session.add(new_game)
            db.session.commit()
        except:
            return 'ERROR'
        return 'SUCCESS'

@app.route('/TicTacToe', methods = ['GET', 'POST'])
def route_TicTacToe():
    if request.method == 'GET':
        games = TwoPlayerGame.query.filter_by(game = 'TTT')
        game_list = [{'id': game.id, 'player1_username': game.player1_username, 'player2_username': game.player2_username, 'winner': game.winner} for game in games]
        return jsonify(game_list)
    
    elif request.method == 'POST':
        game_data = request.get_json()
        new_game = TwoPlayerGame(player1_username = game_data['player1_username'], player2_username = game_data['player2_username'], winner = game_data['winner'], game = 'TTT')
        try:
            db.session.add(new_game)
            db.session.commit()
        except:
            return 'ERROR'
        return 'SUCCESS'
    
@app.route('/players_mobile', methods = ['GET'])
def route_players_mobile():
    players = Player.query.all()
    player_list = [{'username': player.username, 'email': player.email} for player in players]
    response = {'players': player_list}
    return jsonify(response)

@app.route('/minesweeper_mobile', methods = ['GET'])
def route_minesweeper_mobile():
    games = Buscaminas.query.order_by(Buscaminas.time).all()
    game_list = [{'id': game.id, 'player_username': game.player_username, 'time': game.time} for game in games]
    response = {'leaderboard': game_list}
    return jsonify(response)

@app.route('/Connect4_mobile', methods = ['GET'])
def route_connect4_mobile():
    games = TwoPlayerGame.query.filter_by(game = 'C4')
    game_list = [{'id': game.id, 'player1_username': game.player1_username, 'player2_username': game.player2_username, 'winner': game.winner} for game in games]
    response = {'winners': game_list}
    return jsonify(response)

@app.route('/TicTacToe_mobile', methods = ['GET'])
def route_tictactoe_mobile():
    games = TwoPlayerGame.query.filter_by(game = 'TTT')
    game_list = [{'id': game.id, 'player1_username': game.player1_username, 'player2_username': game.player2_username, 'winner': game.winner} for game in games]
    response = {'winners': game_list}
    return jsonify(response)

if __name__ == '__main__':
    app.run(port=5000)