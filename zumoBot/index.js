var ZumoDriver = require('./../zumoDriver');

var ZumoBot = function(board, joystick, five) {
	var configs = five.Motor.SHIELD_CONFIGS.POLOLU_DRV8835_SHIELD;

	[configs.M1, configs.M2].forEach(function(configObj) {
		configObj.board = board;
	});

  var motor1 = new five.Motor(configs.M1);
  var motor2 = new five.Motor(configs.M2);
  var motors = {
    leftMotor: motor1,
    rightMotor: motor2
  };
  
  var laser = new five.Led({ board: board, pin: 4 });
  var buzzer = new five.Piezo({ board: board, pin: 3 });

  return new ZumoDriver({ motors: motors, laser: laser, buzzer: buzzer });
};

module.exports = ZumoBot;