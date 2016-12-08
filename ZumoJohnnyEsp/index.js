"use strict";

var ZumoJohnnyEsp = function(name, board, five) {
  console.log("Hello, I'm ZumoJohnnyEsp, and I've got board", board.port);
	//var configs = five.Motor.SHIELD_CONFIGS.POLOLU_DRV8835_SHIELD;

  var configs = {
    M1: {
      pins: { pwm: 15, dir: 12 },
      board: board
    },
    M2: {
      pins: { pwm: 14, dir: 13 },
      board: board
    }
  };

  var motor1 = new five.Motor(configs.M1);
  var motor2 = new five.Motor(configs.M2);

  motor1.forward = motorFunctionFactory(configs.M1, 1);
  motor1.reverse = motorFunctionFactory(configs.M1, 0);
  motor2.forward = motorFunctionFactory(configs.M2, 1);
  motor2.reverse = motorFunctionFactory(configs.M2, 0);

  function motorFunctionFactory(config, direction) {
    return function(speed) {
      if(speed > 40) {
        this.setPin(config.pins.dir, direction);
        this.setPWM(config.pins.pwm, speed * 4);
      } else {
        this.setPWM(config.pins.pwm, 0);
      }
    };
  }

  this.motors = {
    leftMotor: motor1,
    rightMotor: motor2
  };

  this.name = name;
  
  /*
  var laser = new five.Led({ board: board, pin: 4 });
  var buzzer = new five.Piezo({ board: board, pin: 3 });
  */
};

module.exports = ZumoJohnnyEsp;