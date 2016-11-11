var Joystick = function(name) {
	this.name = name;
	this.selectedRobot = ko.observable();
	
	this.mappedRobot = ko.observable();
	
	this.requestMapRemoval = function() {
		socket.emit('clientEvent', { action: 'requestMapRemoval', joystick: this.name });
	};
	this.monitorJoystick = function() {
		socket.emit('clientEvent', { action: 'monitorJoystick', joystick: this.name });
	};
};

//module.exports = Joystick;