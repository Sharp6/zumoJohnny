var NunchukJoystick = function(board, five) {
	this.joystick = new five.Wii.Nunchuk({freq: 50 });
	this.fireButton = "z";

	this.joystick.joystick.on("change", function(event) {
		console.log("move", event.target[event.axis], event.axis);
		this.emit("move", event.target[event.axis], event.axis);

		/*
    console.log(
      "joystick " + event.axis,
      event.target[event.axis],
      event.axis, event.direction
    );
		*/
  }.bind(this));

	this.joystick.on("down", function(event) {
		if(event.target.which == this.fireButton) {
			this.emit("fireButton", "on");
		}
	}.bind(this));

	this.joystick.on("up", function(event) {
		if(event.target.which === this.fireButton) {
			this.emit("fireButton", "off");
		}
	}.bind(this));
};

NunchukJoystick.prototype = Object.create(require('events').EventEmitter.prototype);

module.exports = NunchukJoystick;
