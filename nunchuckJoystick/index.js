var NunchukJoystick = function(board, five) {
	this.joystick = new five.Wii.Nunchuk({ board: board, freq: 50 });
	this.fireButton = "CONFIG ME";

	nunchuk.joystick.on("change", function(event) {
		this.emit("move", event.target[event.axis], event.axis);

		/*
    console.log(
      "joystick " + event.axis,
      event.target[event.axis],
      event.axis, event.direction
    );
		*/
  });

	nunchuk.on("down", function(event) {
		if(event.target.which === this.fireButton) {
			this.emit("fireButton", "on");
		}
	});

	nunchuk.on("up", function(event) {
		if(event.target.which === this.fireButton) {
			this.emit("fireButton", "off");
		}
	});
};

NunchukJoystick.prototype = Object.create(require('events').EventEmitter.prototype);

module.exports = NunchukJoystick;