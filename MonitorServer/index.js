"use strict";
var MonitorServer = function(managers) {
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
			managers.mapperRepository.requestMapping({ joystickName: data.joystick, robotName: data.robot, mappingType:data.mappingType });
		},
		requestMapRemoval: function(data) {
			managers.mapperRepository.requestMapRemoval({ name: data.name });
		},
		createGame: function(data, socket) {
			// Get player objects
			var players = data.players.map(function(player) {
				return managers.playerManager.getPlayerFor(player.name);
			});
			// Get asset objects
			var assets = data.assets.map(function(asset) {
				return managers.assetManager.getAssetFor(asset.assetId);
			});

			var errors = [];
			if(assets.length === 0) {
				errors.push("Game creation failed: no assets are defined.");
			}
			if(players.length === 0) {
				errors.push("Game creation failed: no players are defined.");
			}

			if(errors.length === 0) {
				managers.gameManager.createGame({name: data.name, numberOfChallenges: data.numberOfChallenges, players: players, assets: assets });
			} else {
				socket.emit("errorMessage", { messages: errors });
			}
		},
		startGame: function(data, socket) {
			var game = managers.gameManager.getGameFor(data.gameName);
			game.startGame();
		},
		createPlayer: function(data, socket) {
			managers.playerManager.createPlayer(data);
		}
	};

	managers.gameManager.on("newGame", function(game) {
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

	managers.playerManager.on("newPlayer", function(player) {
		io.emit("newPlayer", player);
	});

	managers.assetManager.on("newAsset", function(asset) {
		console.log("MONITORSERVER got new asset", asset);
		io.emit("newAsset", asset);

		asset.on("assetStateUpdate", function(state) {
			io.emit("assetStateUpdate", { assetId: asset.assetId, state: state });
		});

		asset.on("assetDisconnected", function() {
			io.emit("assetDisconnected", asset.assetId);
		});
	});

	managers.mapperRepository.on("newMapping", function(mapping) {
		io.emit("newMapping", mapping);
	});

	managers.mapperRepository.on("removedMapping", function(mapping) {
		io.emit("removedMapping", mapping);
	});

	io.on('connection', function(socket){
		console.log('a user connected');

		socket.emit('robots', { robots: managers.robotManager.robots });
		socket.emit('joysticks', { joysticks: managers.joystickManager.joysticks });
		socket.emit('players', { players: managers.playerManager.players });
		socket.emit('assets', { assets: managers.assetManager.assets });
    socket.emit('games', { games: managers.gameManager.games });
    socket.emit('mappings', { mappings: managers.mapperRepository.mappings });
		socket.emit('mappingTypes', { mappingTypes: managers.mapperRepository.mappingTypeNames });

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
