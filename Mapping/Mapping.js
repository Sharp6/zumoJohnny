"use strict";

function Mapping(zumo, analogJoystick, mappingType) {
	console.log("MapperCentral: Doing the mapping!", mappingType);

	var stickMove = mappingType.stickMove;
	var fireButton = mappingType.fireButton;

	this.joystick = analogJoystick;
	this.robot = zumo;
	this.joystickName = analogJoystick.name;
	this.robotName = zumo.name;

	this.name = this.robotName + "Mapping" + this.joystickName;

	this.listeners = [];

	this.attachListeners = function() {
		var stickMoveThis = stickMove.bind(this);
		this.listeners.push({ eventName: "stickMove", listener: stickMoveThis });
		this.joystick.on("stickMove", stickMoveThis);

		var fireButtonThis = fireButton.bind(this);
		this.listeners.push({ eventName: "fireButton", listener: fireButtonThis });
		this.joystick.on("fireButton", fireButtonThis);

	}.bind(this);
	
	this.removeListeners = function() {
		this.listeners.forEach(function(listener) {
			this.joystick.removeListener(listener.eventName, listener.listener);
		}.bind(this));
	}.bind(this);
}

module.exports = Mapping;
