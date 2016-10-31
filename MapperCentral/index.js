var MapperCentral = function(joystick, robots, monitor) {

	var performMapping = function(){
		return new Promise(function(resolve,reject) {
			if(robots[0] && joysticks[0]) {
				mapAnalogToZumo(robots[0], joysticks[0]);
				robots[0].buzz();
				resolve();
			} else {
				reject("Robot or joystick not ready");
			}
		});
	};

	function mapAnalogToZumo(zumo, analogJoystick) {
		console.log("MapperCentral: Doing the mapping!");

		analogJoystick.on("stickMove", function() {
			console.log("ZUMOMAPPER: Got a stickmove!");
			var leftMotorSpeed, rightMotorSpeed;

			leftMotorSpeed = rightMotorSpeed = analogJoystick.normalizedPosition.y;
			leftMotorSpeed += analogJoystick.normalizedPosition.x;
			rightMotorSpeed -= analogJoystick.normalizedPosition.x;

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
		});

		analogJoystick.on("fireButton", function(state) {
			if(state === "on") {
				zumo.fire();
			} else {
				zumo.holdFire();
			}
		});
	}

	monitor.on("requestMapping", function(data) {
		console.log("MapperCentral got a request for mapping", data);
		var robot = robots.find(function(robot) {
			return robot.name === data.robotName;
		});
		var joystick = joysticks.find(function(joystick) {
			return joystick.name === data.joystickName;
		});

		mapAnalogToZumo(robot,joystick);
		joystick.notifyBinding(data.robotName);
	});
};

module.exports = MapperCentral;