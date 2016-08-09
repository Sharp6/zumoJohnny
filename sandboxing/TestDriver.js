var TestDriver = function() {
	setInterval(function(){
		this.emit("move", Math.floor(Math.random()*255), "x");
		this.emit("move", Math.floor(Math.random()*255), "y");
	}.bind(this), 1000);
};

TestDriver.prototype = Object.create(require('events').EventEmitter.prototype);

module.exports = TestDriver;