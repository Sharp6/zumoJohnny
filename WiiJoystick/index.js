var ss = require("../socketServer");
var spawn = require('child_process').spawn;

var WiiJoystick = function() {
	console.log("Hello, I'm WiiMote.");

  ss(function(data) {
   var command = data.toString();

   var btnStates = {
     "u": "on",
     "d": "off"
   }

   var btnState = btnStates[command.substring(0,1)];
   var button = command.substring(1);
   console.log("WII EMITIING", button, btnState);
   this.emit(button, btnState);
  }.bind(this));

  var pythonClient = spawn('python', ['WiiJoystick/wii_remote_zj.py']);

  pythonClient.stdout.on('data', function(data) {
    console.log('py stdout', data.toString());
  });

	pythonClient.stderr.on('data', function(data) {
    console.log('py stderr', data.toString());
  });

	pythonClient.on('close', function(code) {
		console.log("Python closed with code", code);
	});

  pythonClient.unref();
};

WiiJoystick.prototype = Object.create(require('events').EventEmitter.prototype);

module.exports = WiiJoystick;
