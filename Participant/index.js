"use strict";

var Participant = function(options) {

	this.player = options.player;
	this.gameName = options.gameName;
	this.points = options.points || 10;

	this.name = this.gameName + "Participant" + this.player.name;

	console.log("Creating participant with name", this.name);

	this.addPoints = function(newPoints) {
		this.points += newPoints;
		this.emit("participantScoreUpdate", this.points);
	}.bind(this);
};

Participant.prototype = Object.create(require('events').EventEmitter.prototype);
module.exports = Participant;