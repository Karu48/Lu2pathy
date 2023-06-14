from dataclasses import dataclass
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

@dataclass
class Player(db.Model):
    username: str
    email: str
    password: str

    username = db.Column(db.String(100), primary_key = True)
    email = db.Column(db.String(100), nullable=False, unique = True)
    password = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f'<Player {self.username}>'
    
@dataclass
class TwoPlayerGame(db.Model):
    id: int
    player1_username: str
    player2_username: str
    winner : str
    game : str

    id = db.Column(db.Integer, primary_key = True)
    player1_username = db.Column(db.String(100), ForeignKey('Player.username'))
    player2_username = db.Column(db.String(100), ForeignKey('Player.username'))
    winner = db.Column(db.String(100), ForeignKey('Player.username'))
    game = db.Column(db.String(100), nullable = False)

    players = relationship('Player')

@dataclass
class Buscaminas(db.Model):
    id: int
    player_username: str
    difficulty: int
    time: int

    id = db.Column(db.Integer, primary_key=True)
    player_username = db.Column(db.String(100), ForeignKey('Player.username'))
    difficulty = db.Column(db.Integer, nullable=False)
    time = db.Column(db.Integer, nullable=False)

    player = relationship('Player')
    

with app.app_context():
    db.create_all()

@app.route('/players', methods = ['GET', 'POST', 'DELETE', 'PUT'])
def route_games():
    if request.method == 'GET':
        return 'TODO'
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
        return 'TODO'

if __name__ == '__main__':
    app.run(port=5000)