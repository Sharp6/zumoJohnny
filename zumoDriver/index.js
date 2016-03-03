var ZumoDriver = function(options) {
	var motors = options.motors;
	var laser = options.laser;
	var buzzer = options.buzzer;

	var speed = options.speed || 255;
	var angleSpeed = options.angleSpeed || 40;

	var fire = function() {
		laser.on();
		buzzer.play({song: ["C4", 1/4]});
	}

	var holdFire = function() {
		laser.off();
	}

	var buzz = function() {
		buzzer.play({
	    // song is composed by an array of pairs of notes and beats
	    // The first argument is the note (null means "no note")
	    // The second argument is the length of time (beat) of the note (or non-note)
	    song: [
	      ["C2", 1 / 4],
	      ["D2", 1 / 4],
	      ["F2", 1 / 4],
	      ["D4", 1 / 4],
	      ["A4", 1 / 4],
	      [null, 1 / 4],
	      ["A4", 1],
	      ["G4", 1]
	    ],
	    tempo: 100
	  });
	}

	var setSpeed = function(newSpeed) {
		speed = newSpeed;
	}

	var goForward = function() {
		motors.leftMotor.reverse(speed);
		motors.rightMotor.reverse(speed);
	}

	var goBackward = function() {
		motors.leftMotor.forward(speed);
		motors.rightMotor.forward(speed);
	}

	var turnLeftForward = function() {
		motors.rightMotor.reverse(angleSpeed);
		motors.leftMotor.reverse(speed);		
	}

	var turnLeftBackward = function() {
		motors.rightMotor.forward(angleSpeed);
		motors.leftMotor.forward(speed);
	}

	var spinLeft = function() {
		motors.rightMotor.forward(speed);
		motors.leftMotor.reverse(speed);
	}

	var turnRightForward = function() {
		motors.rightMotor.reverse(speed);
		motors.leftMotor.reverse(angleSpeed);	
	}

	var turnRightBackward = function() {
		motors.rightMotor.forward(speed);
		motors.leftMotor.forward(angleSpeed);
	}

	var spinRight = function() {
		motors.leftMotor.forward(speed);
		motors.rightMotor.reverse(speed);
	}	

	var stop = function() {
		motors.leftMotor.stop();
		motors.rightMotor.stop();
	}

	var leftDirect = function(mSpeed) {
		if(mSpeed > 0) {
			motors.rightMotor.reverse(mSpeed);
		} else {
			motors.rightMotor.forward(-mSpeed);
		}
	}

	var rightDirect = function(mSpeed) {
		if(mSpeed > 0) {
			motors.leftMotor.reverse(mSpeed);
		} else {
			motors.leftMotor.forward(-mSpeed);
		}
	}

	return {
		setSpeed: setSpeed,
		fire: fire,
		holdFire: holdFire,
		buzz: buzz,
		goForward: goForward,
		goBackward: goBackward,
		turnLeftBackward: turnLeftBackward,
		turnLeftForward: turnLeftForward,
		spinLeft: spinLeft,
		turnRightBackward: turnRightBackward,
		turnRightForward: turnRightForward,
		spinRight: spinRight,
		stop: stop,
		leftDirect: leftDirect,
		rightDirect: rightDirect
	}
}

module.exports = ZumoDriver;