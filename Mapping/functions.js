var stickMove = function(state) {
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
	this.robot.leftDirect(leftMotorSpeed);
	this.robot.rightDirect(rightMotorSpeed);
};

var expoStickMove = function(state) {
	// INTERNAL -------------------------------------
	var leftMotorSpeed, rightMotorSpeed;

	function expo(val) {
		return Math.pow(val,3) / Math.pow(255,2);
	}

	leftMotorSpeed = rightMotorSpeed = expo(state.normalizedPosition.y);
	leftMotorSpeed += expo(state.normalizedPosition.x);
	rightMotorSpeed -= expo(state.normalizedPosition.x);

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
	this.robot.leftDirect(leftMotorSpeed);
	this.robot.rightDirect(rightMotorSpeed);
};

var dpadMove = function(state) {
	// INTERNAL -------------------------------------
	var leftMotorSpeed = 0;
	var rightMotorSpeed = 0;

	if(state.up === "on") {
		leftMotorSpeed += 255;
		rightMotorSpeed += 255;
	}

	if(state.up === "down") {
		leftMotorSpeed -= 255;
		rightMotorSpeed -= 255;
	}

	if(state.up === "left") {
		leftMotorSpeed -= 255;
		rightMotorSpeed += 255;
	}

	if(state.up === "right") {
		leftMotorSpeed += 255;
		rightMotorSpeed -= 255;
	}

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

module.exports = {
	stickMove: stickMove,
	expoStickMove: expoStickMove,
	fireButton: fireButton
}
