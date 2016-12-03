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

  
  motor1.forward = function(speed) {
    motor1.setPin(configs.M1.pins.dir, 1);
    motor1.setPWM(configs.M1.pins.pwm, speed * 4);
  };

  motor1.reverse = function(speed) {
    motor1.setPin(configs.M1.pins.dir, 0);
    motor1.setPWM(configs.M1.pins.pwm, speed * 4);
  };

  motor2.forward = function(speed) {
    motor2.setPin(configs.M2.pins.dir, 1);
    motor2.setPWM(configs.M2.pins.pwm, speed * 4);
  };

  motor2.reverse = function(speed) {
    motor2.setPin(configs.M2.pins.dir, 0);
    motor2.setPWM(configs.M2.pins.pwm, speed * 4);
  };

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