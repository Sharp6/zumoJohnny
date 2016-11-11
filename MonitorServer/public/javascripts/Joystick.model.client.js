var Joystick = function(name) {
	this.name = name;
	this.selectedRobot = ko.observable();
	this.mappedRobot = ko.observable();
	this.requestMapping = function() {
		console.log("Requesting mapping: ", this.name, this.selectedRobot().name);
		socket.emit('clientEvent', { action: 'requestMapping', joystick: this.name, robot: this.selectedRobot().name });
	};
	this.requestMapRemoval = function() {
		socket.emit('clientEvent', { action: 'requestMapRemoval', joystick: this.name });
	};
	this.monitorJoystick = function() {
		socket.emit('clientEvent', { action: 'monitorJoystick', joystick: this.name });
	};
};

//module.exports = Joystick;