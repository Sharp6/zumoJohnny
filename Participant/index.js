"use strict";

var Participant = function(options) {

	this.player = options.player;
	this.game = options.game;
	this.points = options.points || 10;

	this.name = this.game.name + "Participant" + this.player.name;

	this.addPoints = function(newPoints) {
		this.points += newPoints;
		this.emit("participantScoreUpdate", this.points);
	}.bind(this);
};

Participant.prototype = Object.create(require('events').EventEmitter.prototype);
module.exports = Participant;