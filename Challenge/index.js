"use strict";

var Challenge = function(options) {

	var moment = require('moment');

	this.name = options.name;
	this.asset = options.asset;
	this.timeLimit = options.timeLimit || 10;
	this.player = options.player;
	this.points = options.points || 10;
	this.state = "init";

	this.asset.on("assetStateUpdate", function(newState) {
		if(this.state == "active" && newState == "hit") {
			clearTimeout(this.timer);
			this.state = "completed";
			this.emit("stateChange", "challengeComplete");
		}
	}.bind(this));

	this.activate = function() {
		this.activationTime = moment();
		this.state = "active";
		this.emit("stateChange", "activated");

		this.timer = setTimeout(function(){
			this.state = "timeout";
			this.emit("stateChange", "challengeTimeout");
		}.bind(this), this.timeLimit * 1000);
	};
};

Challenge.prototype = Object.create(require('events').EventEmitter.prototype);

module.exports = Challenge;