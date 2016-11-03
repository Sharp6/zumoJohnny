"use strict";

var Game = require("./Game");

var GameManager = function() {
	this.games = [];

	this.createGame = function(options) {
		var newGame = new Game(options);
		this.games.push(newGame);
		this.emit("newGame", newGame);
	}.bind(this);

	this.getGameFor = function(name) {
		return this.games.find(function(game) {
			return game.name === name;
		});
	}.bind(this);
};

GameManager.prototype = Object.create(require('events').EventEmitter.prototype);

module.exports = GameManager;