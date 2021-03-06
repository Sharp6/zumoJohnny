var NunchukJoystick = function(board, five) {
	console.log("Hello, I'm Nunchuk, and I've got board", board.port);

	this.joystick = new five.Wii.Nunchuk({freq: 50, board: board });
	this.fireButton = "z";

	this.joystick.joystick.on("change", function(event) {
		this.emit("move", event.target[event.axis], event.axis);
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
