var Challenge = function(data) {
	this.name = data.name;
	this.timeLimit = data.timeLimit;
	this.points = data.points;

	this.asset = assets().find(function(asset) { 
		return asset.assetId === data.asset.assetId;
	});
		
	this.participant = participants().find(function(participant) {
		return participant.name === data.participant.name;
	});

	this.state = ko.observable(data.state);
};