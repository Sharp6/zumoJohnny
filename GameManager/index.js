"use strict";

var Game = function(options) {
	
	var Challenge = require("../Challenge");
	var moment = require("moment");

	this.assets = options.assets;
	this.players = options.players;
	this.numberOfChallenges = options.numberOfChallenges;

	this.state = "init";

	this.challenges = [];
	generateChallenges();

	this.currentChallenge = 0;

	this.start = function() {
		if(this.state == "init") {
			this.startTime = moment();
			activateChallenge(this.challenges[this.currentChallenge]);
			this.state = "started";
		}
	};

	var activateChallenge = function(challenge) {
		challenge.on("challengeComplete", function() {
			challenge.player.addPoints(challenge.points);
			nextChallenge();
		});
		challenge.on("challengeTimeout", function() {
			nextChallenge();
		}.bind(this));
		challenge.activate();
	}.bind(this);

	var nextChallenge = function() {
		this.currentChallenge++;
		if(this.currentChallenge >= this.numberOfChallenges) {
			this.state = "finished";
		} else {
			activateChallenge(this.currentChallenge);
		}
	}.bind(this);
	
	var generateChallenges = function() {
		for(var i = 0; i < this.numberOfChallenges; i++) {
			var selectedAsset = this.assets[Math.floor(Math.random() * this.assets.length)];
			var timeLimit = 30;
			var newChallenge = new Challenge({asset: selectedAsset, timeLimit: timeLimit});
			this.challenges.push(newChallenge);
		}
	};
};

var GameManager = function() {
	var games = [];

	this.createGame = function(options) {
		var newGame = new Game(options);
		games.push(newGame);
		this.emit(newGame);
	};
};

GameManager.prototype = Object.create(require('events').EventEmitter.prototype);

module.exports = GameManager;