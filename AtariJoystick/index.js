var SocketServer = require("../socketServer");

var AtariJoystick = function(zumo) {
	var keys = {
		up: "z",
		down: "s",
		left: "q",
		right: "d",
		fire: "&"
	}

	var keyState = [];

	SocketServer(function(buff) {
		var message = buff.toString();
		if(message.substring(0,4) === "down") {
			var key = message.substring(4);
			addKey(key);
			updateZumo();
		} else if(message.substring(0,2) === "up") {
			var key = message.substring(2);
			removeKey(key);
			updateZumo();
		} else {
			console.log("Got strange message.");
		}
	});

	function addKey(key) {
		if(!keyState.includes(key) && key.length == 1) {
			keyState.push(key);
		}
	}

	function removeKey(key) {
		var pos = keyState.indexOf(key);
		if(pos > -1) {
			keyState.splice(pos,1);	
		}		
	}

	function updateZumo() {
		if(keyState.length > 0) {
			if(keyState.indexOf(keys.fire) > -1) {
				zumo.fire();
			} else {
				zumo.holdFire();
			}
			if(keyState.indexOf(keys.up) > -1) {
				if(keyState.indexOf(keys.left) > -1) {
					zumo.turnLeftForward();
				} else if(keyState.indexOf(keys.right) > -1) {
					zumo.turnRightForward();
				} else {
					zumo.goForward();
				}
			} else if(keyState.indexOf(keys.down) > -1) {
				if(keyState.indexOf(keys.left) > -1) {
					zumo.turnLeftBackward();
				} else if(keyState.indexOf(keys.right) > -1) {
					zumo.turnRightBackward();
				} else {
					zumo.goBackward();
				}
			} else if(keyState.indexOf(keys.left) > -1) {
				zumo.spinLeft();
			} else if(keyState.indexOf(keys.right) > -1) {
				zumo.spinRight();
			}
		} else {
			zumo.stop();
			zumo.holdFire();
		}
		console.log(keyState);
	}
}

module.exports = AtariJoystick;