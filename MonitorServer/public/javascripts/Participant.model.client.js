var Participant = function(data) {
	this.name = data.name;
	this.player = data.player;
	this.score = ko.observable(data.score);
}