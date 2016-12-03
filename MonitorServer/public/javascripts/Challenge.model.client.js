"use strict";

var Challenge = function(data) {
	this.name = data.name;
	this.timeLimit = data.timeLimit;
	this.points = data.points;

	this.asset = assets().find(function(asset) { 
		return asset.assetId === data.asset.assetId;
	});
		
	// This can't work: got no participants. Oh wait, it's client-side, it can... I should start with ES6 modules.
	this.participant = participants().find(function(participant) {
		return participant.name === data.participant.name;
	});

	this.state = ko.observable(data.state);
};