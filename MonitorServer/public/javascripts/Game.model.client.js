var Game = function(data) {
	this.name = data.name;
	this.numberOfChallenges = data.numberOfChallenges;
	this.state = ko.observable(data.state);

	data.participants.forEach(function(participantData) {
		var player = players().find(function(player) {
			return player.name === participantData.player.name;
		});
		var newParticipant = new Participant({ 
			name: participantData.name,
			player: player,
			score: participantData.score
		});
		participants.push(newParticipant);
		player.participants.push(newParticipant);
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