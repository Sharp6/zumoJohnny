// An analogjoystick is an eventEmitter 
// which emits 
// - joystickEvents, normalized between -255 and 255, called "stickMove"
// - buttonEvents, for on and off events, called "fireButton" with a state


var AnalogJoystick = function(driver) {

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

	driver.on("move", function(val, axis) {
		console.log("AJ", val, axis);
		this.rawPosition[axis] = val;

		updateExtremes(val,axis);
		calculateNormalizedPosition();

		this.emit("stickMove");
	}.bind(this));

	driver.on("fireButton", function(state) {
		console.log("AJ FIRE", state);
		this.emit("fireButton", state);
	}.bind(this));

};

AnalogJoystick.prototype = Object.create(require('events').EventEmitter.prototype);

module.exports = AnalogJoystick;
