var dualShock = require('dualshock-controller');

var Ps3Joystick = function(zumo) {

	var ps3 = dualShock({
		config : "dualShock3",
	  accelerometerSmoothing : true,
	  analogStickSmoothing : true
	});

	var xpos, ypos;
	var leftMotorSpeed, rightMotorSpeed;
	var ldirection, rdirection;

	ps3.on('left:move', function(data) {
		xpos = data.x - 128;
		ypos = data.y - 128;
		ypos = -ypos;

		updateZumo();
	});

	ps3.on('square:press', function() {
		zumo.fire();
	});

	ps3.on('square:release', function() {
		zumo.holdFire();
	});

	function updateZumo() {
		leftMotorSpeed = rightMotorSpeed = ypos;
		leftMotorSpeed = leftMotorSpeed + xpos;
		rightMotorSpeed = rightMotorSpeed - xpos;

		leftMotorSpeed = leftMotorSpeed * 2;
		if (leftMotorSpeed > 255) {
			leftMotorSpeed = 255;
		} else if (leftMotorSpeed < -255) {
			leftMotorSpeed = -255;
		}

		rightMotorSpeed = rightMotorSpeed * 2;
		if (rightMotorSpeed > 255) {
			rightMotorSpeed = 255;
		} else if (rightMotorSpeed < -255) {
			rightMotorSpeed = -255;
		}

		zumo.leftDirect(leftMotorSpeed);
		zumo.rightDirect(rightMotorSpeed);

	}
}

module.exports = Ps3Joystick;
