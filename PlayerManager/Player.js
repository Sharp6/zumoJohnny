"use strict";

var Player = function(options) {
	this.name = options.name;
};

Player.prototype = Object.create(require('events').EventEmitter.prototype);
module.exports = Player;