"use strict";

var Game = function(data) {
	this.name = data.name;
	this.numberOfChallenges = data.numberOfChallenges;
	this.state = ko.observable(data.state); // global library

	this.participants = data.participants.map(function(participantData) {
		var player = players().find(function(player) { // AUCH GLOBAL
			return player.name === participantData.player.name;
		});
		var newParticipant = new Participant({ // global constructor
			name: participantData.name,
			player: player,
			score: participantData.score
		});
		player.participants.push(newParticipant);

		return newParticipant;
	});

	this.assets = data.assets.map(function(assetData) {
		return assets().find(function(asset) {
			return asset.assetId === assetData.assetId;
		});
	});

	this.challenges = data.challenges.map(function(challegeData) {
		return new Challenge(challegeData);
	});

	this.startGame = function() {
		socket.emit('clientEvent', { action: 'startGame', gameName: this.name });
	}
};
