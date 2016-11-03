"use strict";

var Challenge = function(options) {

	var moment = require('moment');

	this.asset = options.asset;
	this.timeLimit = options.timeLimit;
	this.player = options.player;
	this.points = options.points;
	this.state = "init";

	this.asset.on("assetStateUpdate", function(newState) {
		if(this.state == "active" && newState == "hit") {
			this.state = "completed";
			clearTimeout(this.timer);
			this.emit("challengeComplete");
		}
	}.bind(this));

	this.activate = function() {
		this.activationTime = moment();
		this.state = "active";

		this.timer = setTimeout(function(){
			this.state = "timeout";
			this.emit("challengeTimeout");
		}.bind(this), this.timeLimit * 1000);
	};
};

Challenge.prototype = Object.create(require('events').EventEmitter.prototype);

module.exports = Challenge;