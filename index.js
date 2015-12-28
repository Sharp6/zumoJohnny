var five = require("johnny-five");
var keypress = require("keypress");
var board = new five.Board({
	//port: "/dev/cu.usbserial-DA00SPHK"
});

board.on("ready", function() {
  console.log("Ready!");

  var configs = five.Motor.SHIELD_CONFIGS.POLOLU_DRV8835_SHIELD;

  var motor1 = new five.Motor(configs.M1);
  var motor2 = new five.Motor(configs.M2);


  function controller(ch,key) {

  	if(key.name === "up") {
  		motor1.forward(100);
      motor2.forward(100);  
  	} else if(key.name === "down") {
  		motor1.reverse(100);
      motor2.reverse(100);
  	} else {
  		motor1.stop();
  		motor2.stop();
  	}
  }

  keypress(process.stdin);

  process.stdin.on("keypress", controller);
  process.stdin.setRawMode(true);
  process.stdin.resume();
});