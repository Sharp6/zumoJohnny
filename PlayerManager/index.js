"use strict";

var Player = function(options) {
	this.name = options.name;
};

var PlayerManager = function() {
	this.players = [];

	this.createPlayer = function(options) {
		var newPlayer = new Player(options);
		this.players.push(newPlayer);
		this.emit("newPlayer", newPlayer);
	};
};

PlayerManager.prototype = Object.create(require('events').EventEmitter.prototype);
module.exports = PlayerManager;