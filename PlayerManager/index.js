"use strict";

var Player = function(options) {
	this.name = options.name;
};

var PlayerManager = function() {

};

PlayerManager.prototype = Object.create(require('events').EventEmitter.prototype);

module.exports = PlayerManager;