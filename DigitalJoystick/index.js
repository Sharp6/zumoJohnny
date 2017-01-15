var DigitalJoystick = function(name, driver) {

	this.name = name;

  this.dpadState = {
    "up": "off",
    "down": "off",
    "left": "off",
    "right": "off"
  }

	driver.on("left", function(state) {
    this.dpadState["left"] = state;
    this.emit("stickMove", this.dpadState);
	}.bind(this));

  driver.on("right", function(state) {
    this.dpadState["right"] = state;
    this.emit("stickMove", this.dpadState);
	}.bind(this));

  driver.on("up", function(state) {
    this.dpadState["up"] = state;
    this.emit("stickMove", this.dpadState);
	}.bind(this));

  driver.on("down", function(state) {
    this.dpadState["down"] = state;
    this.emit("stickMove", this.dpadState);
	}.bind(this));

	driver.on("fireButton", function(state) {
		this.emit("fireButton", state);
	}.bind(this));
};

// I should document where I got this shizzle from.
// Seems to come from http://www.hacksparrow.com/node-js-eventemitter-tutorial.html
// I also referenced article http://blog.yld.io/2015/12/15/using-an-event-emitter/#.WAvIs2OTngI
DigitalJoystick.prototype = Object.create(require('events').EventEmitter.prototype);

module.exports = DigitalJoystick;
