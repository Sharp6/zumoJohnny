"use strict";
var MonitorServer = function(joysticks,robots,managers) {
	var express = require('express');
	var path = require('path');
	var app = express();
	var http = require('http').Server(app);
	var io = require('socket.io')(http);
	app.get('/', function(req, res) {
		res.sendFile(__dirname +'/index.html');
	});
	app.use(express.static(path.join(__dirname, 'public')));

	var assetManager = managers.assetManager;

	function moveCallback(state) {
		io.emit("stickExtremesReport", state.extremes);
		io.emit("normalizedPositionReport", state.normalizedPosition);
		io.emit("rawPositionReport", state.rawPosition);
	}

	function buttonCallback(state) {
		io.emit("fireButton", state);
	}

	function attachListenersTo(joystick) {
		joystick.on("stickMove", moveCallback);
		joystick.on("fireButton", buttonCallback);
	}

	function removeListenersOf(joystick) {
		joystick.removeListener("stickMove", moveCallback);
		joystick.removeListener("fireButton", buttonCallback);
	}

	var handlers = {
		monitorJoystick: function(data, socket) {
			joysticks.forEach(function(joystick) {
				if(joystick.name === data.joystick) {
					attachListenersTo(joystick);
				} else {
					removeListenersOf(joystick);
				}
			});
		},
		disconnectJoystick: function(data, socket) {
			var joystick = joysticks.find(function(joystick) {
				return joystick.name === data.joystick;
			});
			removeListenersOf(joystick);
		},
		requestMapping: function(data) {
			this.emit('requestMapping', { joystickName: data.joystick, robotName: data.robot });
		}.bind(this),
		requestMapRemoval: function(data) {
			this.emit('requestMapRemoval', { joystickName: data.joystick });
		}.bind(this),
		createGame: function(data, socket) {
			// Get player objects
			var players = data.players.map(function(player) {
				return managers.playerManager.getPlayerFor(player.name);
			});
			// Get asset objects
			var assets = data.assets.map(function(asset) {
				return managers.assetManager.getAssetFor(asset.assetId);
			});

			if(assets.length > 0 && players.length > 0) {
				managers.gameManager.createGame({name: data.name, numberOfChallenges: data.numberOfChallenges, players: players, assets: assets });
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

	var joystickNames = joysticks.map(function(joystick) {
		return joystick.name;
	});

	var robotNames = robots.map(function(robot) {
		return robot.name;
	});

	managers.gameManager.on("newGame", function(game) {
		io.emit("newGame", game);

		game.on("gameStateChange", function(state) {
			io.emit("gameStateChange", game.name + "|" + state);
		});

		game.challenges.forEach(function(challenge) {
			challenge.on("stateChange", function(challengeState) {
				io.emit("challengeStateChange", challenge.name + "|" + challengeState);
			});
		});
	});

	managers.playerManager.on("newPlayer", function(player) {
		io.emit("newPlayer", player);

		player.on("playerScoreUpdate", function(score) {
			io.emit("playerScoreUpdate", player.name + "|" + score);
		});
	});

	assetManager.on("newAsset", function(asset) {
		console.log("MONITORSERVER got new asset", asset);
		io.emit("newAsset", asset);

		asset.on("assetStateUpdate", function(state) {
			io.emit("assetStateUpdate", asset.assetId + "|" + state);
		});

		asset.on("assetDisconnected", function() {
			io.emit("assetDisconnected", asset.assetId);
		});
	});

	joysticks.forEach(function(joystick) {
		joystick.on("bindingNotification", function(data) {
			io.emit("bindingNotification", data);
		});
	});

	io.on('connection', function(socket){
		console.log('a user connected');

		socket.emit('robots', { names: robotNames });
		socket.emit('joysticks', { names: joystickNames });
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