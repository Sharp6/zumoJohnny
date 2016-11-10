"use strict";

function Mapping(zumo, analogJoystick) {
	console.log("MapperCentral: Doing the mapping!");

	function stickMove(state) {
		console.log("ZUMOMAPPER: Got a stickmove!");
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

		console.log("Calling the robot with", leftMotorSpeed, rightMotorSpeed);
		zumo.leftDirect(leftMotorSpeed);
		zumo.rightDirect(rightMotorSpeed);
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

	this.attachListeners = function() {
		this.joystick.on("stickMove", stickMove);
		this.joystick.on("fireButton", fireButton);
	}.bind(this);
	
	this.removeListeners = function() {
		this.joystick.removeListener("stickMove", stickMove);
		this.joystick.removeListener("fireButton", fireButton);
	}.bind(this);
}

module.exports = Mapping;