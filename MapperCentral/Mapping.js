"use strict";

function Mapping(zumo, analogJoystick, mappingTypeName) {
	console.log("MapperCentral: Doing the mapping!");

	function stickMove(state) {
		console.log("ZUMOMAPPER: Got a stickmove!");

		// INTERNAL -------------------------------------
		var leftMotorSpeed, rightMotorSpeed;

		leftMotorSpeed = rightMotorSpeed = state.normalizedPosition.y;
		leftMotorSpeed += state.normalizedPosition.x;
		rightMotorSpeed -= state.normalizedPosition.x;

		// This should never happen
		if (leftMotorSpeed > 255) {
			leftMotorSpeed = 255;
		} else if (leftMotorSpeed < -255) {
			leftMotorSpeed = -255;
		}

		// This should never happen
		if (rightMotorSpeed > 255) {
			rightMotorSpeed = 255;
		} else if (rightMotorSpeed < -255) {
			rightMotorSpeed = -255;
		}

		// EXTERNAL -------------------------------------
		console.log("Calling the robot with", leftMotorSpeed, rightMotorSpeed);
		this.robot.leftDirect(leftMotorSpeed);
		this.robot.rightDirect(rightMotorSpeed);
	}

	function fireButton(state) {
		if(state === "on") {
			zumo.fire();
		} else {
			zumo.holdFire();
		}
	}

	this.joystick = analogJoystick;
	this.robot = zumo;
	this.joystickName = analogJoystick.name;
	this.robotName = zumo.name;

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