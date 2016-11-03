"use strict";

var Player = function(options) {
	this.name = options.name;
	this.points = 0;

	this.addPoints = function(newPoints) {
		this.points += newPoints;
	}.bind(this);
};

var PlayerManager = function() {
	this.players = [];

	this.createPlayer = function(options) {
		var newPlayer = new Player(options);
		this.players.push(newPlayer);
		this.emit("newPlayer", newPlayer);
	};

	this.getPlayerFor = function(name) {
		return this.players.find(function(player) {
			return player.name == name;
		});
	}.bind(this);
};

PlayerManager.prototype = Object.create(require('events').EventEmitter.prototype);
module.exports = PlayerManager;