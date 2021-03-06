var ZumoJohnnyDirect = function(name, board, five) {
  console.log("Hello, I'm Zumo, and I've got board", board.port);
  this.name = name;
	var configs = five.Motor.SHIELD_CONFIGS.POLOLU_DRV8835_SHIELD;

	[configs.M1, configs.M2].forEach(function(configObj) {
		configObj.board = board;
	});

  var motor1 = new five.Motor(configs.M1);
  var motor2 = new five.Motor(configs.M2);
  
  this.motors = {
    leftMotor: motor1,
    rightMotor: motor2
  };
  this.laser = new five.Led({ board: board, pin: 4 });
  this.buzzer = new five.Piezo({ board: board, pin: 3 });
};

module.exports = ZumoJohnnyDirect;