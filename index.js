var five = require("johnny-five");
var keypress = require("keypress");
var ZumoController = require("./zumoController");
var board = new five.Board({
	//port: "/dev/cu.usbserial-DA00SPHK"
});

board.on("ready", function() {
  console.log("Ready!");

  var configs = five.Motor.SHIELD_CONFIGS.POLOLU_DRV8835_SHIELD;

  var motor1 = new five.Motor(configs.M1);
  var motor2 = new five.Motor(configs.M2);

  var motors = {
    leftMotor: motor1,
    rightMotor: motor2
  }

  var speed = 255;
  var angleSpeed = 50;

  var zumoContoller = new ZumoController(motors, speed, angleSpeed);

  function controller(ch,key) {

    if(key) {
      if(key.name === "z") {
        zumoContoller.goBackward();  
      } else if(key.name === "s") {
        zumoContoller.goForward();
      } else if(key.name === "q") {
        zumoContoller.turnLeftForward();
      } else if(key.name === "d") {
        zumoContoller.turnRightForward();
      }  
    } else {
  		zumoContoller.stop();
  	}
  }

  keypress(process.stdin);

  process.stdin.on("keypress", controller);
  process.stdin.setRawMode(true);
  process.stdin.resume();
});