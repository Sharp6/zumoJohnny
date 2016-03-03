
var five = require("johnny-five");

var ZumoDriver = require("./zumoDriver");
var AtariJoystick = require("./AtariJoystick");
var Ps3Joystick = require("./ps3Joystick");

var board = new five.Board();

board.on("ready", function() {
	console.log("Board is ready.");
	var zumo = zumoInit();
	//var joystick = new AtariJoystick(zumo);
	var joystick = new Ps3Joystick(zumo);

	zumo.buzz();
});

function zumoInit() {
	var configs = five.Motor.SHIELD_CONFIGS.POLOLU_DRV8835_SHIELD;

  var motor1 = new five.Motor(configs.M1);
  var motor2 = new five.Motor(configs.M2);

  var laser = new five.Led(4);

  var buzzer = new five.Piezo(3);

  var motors = {
    leftMotor: motor1,
    rightMotor: motor2
  }
  return new ZumoDriver({ motors: motors, laser: laser, buzzer: buzzer });
}