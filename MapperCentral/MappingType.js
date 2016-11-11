"use strict";

var MappingType = function() {
	var stickMove = function(state) {
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
	};

	var fireButton = function(state) {
		if(state === "on") {
			this.robot.fire();
		} else {
			this.robot.holdFire();
		}
	};

	this.getStickMove = function() {
		return stickMove;
	};

	this.getFireButton = function() {
		return fireButton;
	};
};

module.exports = MappingType;