var TestDriver = function() {

	var minInitVal = 255;
	var maxInitVal = 0;

	this.extremes = {
		x: {
			min: minInitVal,
			max: maxInitVal
		},
		y: {
			min: minInitVal,
			max: maxInitVal
		}
	};

	this.normalizedPosition = {
		x: 0,
		y: 0
	};

	this.rawPosition = {
		x: 0,
		y: 0
	};

	var updateExtremes = function(val, axis) {
		if(val < this.extremes[axis].min) {
			this.extremes[axis].min = val;
		}
		if(val > this.extremes[axis].max) {
			this.extremes[axis].max = val;
		}
	}.bind(this);

	var calculateNormalizedPosition = function() {
		var ranges = {
			x: this.extremes.x.max - this.extremes.x.min,
			y: this.extremes.y.max - this.extremes.y.min
		};

		this.normalizedPosition.x = Math.floor((((this.rawPosition.x - this.extremes.x.min) / ranges.x) * 512) - 255 );
		this.normalizedPosition.y = Math.floor((((this.rawPosition.y - this.extremes.y.min) / ranges.y) * 512) - 255 );
	}.bind(this);

	setInterval(function(){

		this.rawPosition["x"] = Math.floor(Math.random()*255);
		this.rawPosition["y"] = Math.floor(Math.random()*255);

		updateExtremes(this.rawPosition["x"],"x");
		updateExtremes(this.rawPosition["y"],"y");
		calculateNormalizedPosition();

		this.emit("stickMove");

	}.bind(this), 1000);
};

TestDriver.prototype = Object.create(require('events').EventEmitter.prototype);

module.exports = TestDriver;