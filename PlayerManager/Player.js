var Player = function(options) {
	this.name = options.name;
	this.points = 0;

	this.addPoints = function(newPoints) {
		this.points += newPoints;
		this.emit("playerScoreUpdate", this.points);
	}.bind(this);
};

Player.prototype = Object.create(require('events').EventEmitter.prototype);
module.exports = Player;