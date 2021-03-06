"use strict";

var Game = function(options) {
	
	var Challenge = require("../Challenge");
	var Participant = require("../Participant");
	var moment = require("moment");

	console.log("GAME MAKING GAME", options);

	this.name = options.name || "default";
	this.assets = options.assets;
	this.players = options.players;
	this.numberOfChallenges = options.numberOfChallenges;
	this.challengeDelayTime = options.challengeDelayTime || 1000;
	
	this.participants = this.players.map(function(player) {
		return new Participant({player: player, gameName: this.name});
	}.bind(this));

	this.challenges = [];
	this.currentChallenge = 0;
	this.state = "init";

	this.participants.forEach(function(participant) {
		for(var i = 0; i < this.numberOfChallenges; i++) {
			var challengeName = this.name + "Challenge" + i;
			var selectedAsset = this.assets[Math.floor(Math.random() * this.assets.length)];
			var newChallenge = new Challenge({ name: challengeName, asset: selectedAsset, participant: participant });
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
		this.emit("gameStateChange", newState);
		this.state = newState;
	}.bind(this);

	var activateChallenge = function(challenge) {
		challenge.on("stateChange", function(challengeState) {
			if(challengeState === "challengeComplete") {
				challenge.participant.addPoints(challenge.points);
				setTimeout(nextChallenge, this.challengeDelayTime);
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
			activateChallenge(this.challenges[this.currentChallenge]);
		}
	}.bind(this);
};

Game.prototype = Object.create(require('events').EventEmitter.prototype);
module.exports = Game;