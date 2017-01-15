var TankBot = function(driver) {
	var name = driver.name;

	var motors = driver.motors;
	var laser = driver.laser;
	var buzzer = driver.buzzer;

	var fire = function() {
		laser.on();
		buzzer.play({song: ["C4", 1/4]});
	};

	var holdFire = function() {
		laser.off();
	};

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
	};

	var leftDirect = function(mSpeed) {
		//console.log("ZUMODRIVER: DRIVING LEFT");
		if(mSpeed > 0) {
			motors.rightMotor.reverse(mSpeed);
		} else {
			motors.rightMotor.forward(-mSpeed);
		}
	};

	var rightDirect = function(mSpeed) {
		//console.log("ZUMODRIVER: DRIVING RIGHT");
		if(mSpeed > 0) {
			motors.leftMotor.reverse(Math.abs(mSpeed));
		} else {
			motors.leftMotor.forward(Math.abs(mSpeed));
		}
	};

	return {
		name: name,
		fire: fire,
		holdFire: holdFire,
		buzz: buzz,
		leftDirect: leftDirect,
		rightDirect: rightDirect
	};
};

module.exports = TankBot;
