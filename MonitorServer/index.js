"use strict";
var MonitorServer = function(repositories) {
	var express = require('express');
	var path = require('path');
	var app = express();
	var http = require('http').Server(app);
	var io = require('socket.io')(http);
	app.get('/', function(req, res) {
		res.sendFile(__dirname +'/index.html');
	});
	app.use(express.static(path.join(__dirname, 'public')));

	var handlers = {
		requestMapping: function(data) {
			repositories.mappingRepo.requestMapping({ joystickName: data.joystick, robotName: data.robot, mappingType:data.mappingType });
		},
		requestMapRemoval: function(data) {
			repositories.mappingRepo.requestMapRemoval({ name: data.name });
		},
		createGame: function(data, socket) {
			// Get player objects
			var players = data.players.map(function(player) {
				return repositories.playerRepo.getPlayerFor(player.name);
			});
			// Get asset objects
			var assets = data.assets.map(function(asset) {
				return repositories.assetRepo.getAssetFor(asset.assetId);
			});

			var errors = [];
			if(assets.length === 0) {
				errors.push("Game creation failed: no assets are defined.");
			}
			if(players.length === 0) {
				errors.push("Game creation failed: no players are defined.");
			}

			if(errors.length === 0) {
				repositories.gameRepo.createGame({name: data.name, numberOfChallenges: data.numberOfChallenges, players: players, assets: assets });
			} else {
				socket.emit("errorMessage", { messages: errors });
			}
		},
		startGame: function(data, socket) {
			var game = repositories.gameRepo.getGameFor(data.gameName);
			game.startGame();
		},
		createPlayer: function(data, socket) {
			repositories.playerRepo.createPlayer(data);
		}
	};

	repositories.gameRepo.on("newGame", function(game) {
		io.emit("newGame", game);

		game.on("gameStateChange", function(state) {
			io.emit("gameStateChange", { gameName: game.name, state: state });
		});

		game.challenges.forEach(function(challenge) {
			challenge.on("stateChange", function(challengeState) {
				io.emit("challengeStateChange", { challengeName: challenge.name,  state: challengeState });
			});
		});

		game.participants.forEach(function(participant) {
			participant.on("participantScoreUpdate", function(score) {
				console.log("MonitorServer: Updating score for participant", participant.name);
				io.emit("participantScoreUpdate", { participantName: participant.name, score: score });
			});
		});
	});

	repositories.playerRepo.on("newPlayer", function(player) {
		io.emit("newPlayer", player);
	});

	repositories.assetRepo.on("newAsset", function(asset) {
		console.log("MONITORSERVER got new asset", asset);
		io.emit("newAsset", asset);

		asset.on("assetStateUpdate", function(state) {
			io.emit("assetStateUpdate", { assetId: asset.assetId, state: state });
		});

		asset.on("assetDisconnected", function() {
			io.emit("assetDisconnected", asset.assetId);
		});
	});

	repositories.mappingRepo.on("newMapping", function(mapping) {
		io.emit("newMapping", mapping);
	});

	repositories.mappingRepo.on("removedMapping", function(mapping) {
		io.emit("removedMapping", mapping);
	});

	io.on('connection', function(socket){
		console.log('a user connected');

		socket.emit('robots', { robots: repositories.robotRepo.robots });
		socket.emit('joysticks', { joysticks: repositories.joystickRepo.joysticks });
		socket.emit('players', { players: repositories.playerRepo.players });
		socket.emit('assets', { assets: repositories.assetRepo.assets });
    socket.emit('games', { games: repositories.gameRepo.games });
    socket.emit('mappings', { mappings: repositories.mappingRepo.mappings });
		socket.emit('mappingTypes', { mappingTypes: repositories.mappingRepo.mappingTypeNames });

		socket.on('clientEvent', function(data) {
			if(data.action && handlers[data.action]) {
				handlers[data.action](data, socket);
			} else {
				console.log("No suitable handler found for action", data.action);
			}
		});
	});

	http.listen(1804, function(){
		console.log('listening on *:1804');
	});
};

// I should document where I got this shizzle from.
// Seems to come from http://www.hacksparrow.com/node-js-eventemitter-tutorial.html
// I also referenced article http://blog.yld.io/2015/12/15/using-an-event-emitter/#.WAvIs2OTngI
MonitorServer.prototype = Object.create(require('events').EventEmitter.prototype);

module.exports = MonitorServer;
