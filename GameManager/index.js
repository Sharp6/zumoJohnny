"use strict";

var Game = function(options) {
	
	var Challenge = require("../Challenge");
	var moment = require("moment");

	this.name = options.name || "default";
	this.assets = options.assets;
	this.players = options.players;
	this.numberOfChallenges = options.numberOfChallenges;
	
	this.challenges = [];
	this.currentChallenge = 0;
	this.state = "init";

	this.players.forEach(function(player) {
		for(var i = 0; i < this.numberOfChallenges; i++) {
			var challengeName = this.name + "Challenge" + i;
			var selectedAsset = this.assets[Math.floor(Math.random() * this.assets.length)];
			var newChallenge = new Challenge({ name: challengeName, asset: selectedAsset, player: player });
			this.challenges.push(newChallenge);
		}
	}.bind(this));
	

	this.startGame = function() {
		if(this.state == "init") {
			this.startTime = moment();
			activateChallenge(this.challenges[this.currentChallenge]);
			updateGameState("started");
		}
	};

	var updateGameState = function(newState) {
		this.emit("gameStateChage", newState);
		this.state = newState;
	}.bind(this);

	var activateChallenge = function(challenge) {
		challenge.on("stateChange", function(challengeState) {
			if(challengeState === "challengeComplete") {
				challenge.player.addPoints(challenge.points);
				nextChallenge();
			}
			if(challengeState === "challengeTimeout") {
				nextChallenge();
			}
		}.bind(this));
		challenge.activate();
	}.bind(this);

	var finishGame = function() {
		this.finishTime = moment();
		updateGameState("finished");
	}.bind(this);

	var nextChallenge = function() {
		this.currentChallenge++;
		if(this.currentChallenge >= this.numberOfChallenges) {
			finishGame();
		} else {
			activateChallenge(this.currentChallenge);
		}
	}.bind(this);
};

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