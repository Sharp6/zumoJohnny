var monitorServer = function(joysticks) {
	var express = require('express');
	var path = require('path');
	var app = express();
	var http = require('http').Server(app);
	var io = require('socket.io')(http);

	console.log("joystick wants to be used.");

	function moveCallback() {
		io.emit("stickExtremesReport", this.extremes);
		io.emit("normalizedPositionReport", this.normalizedPosition);
		io.emit("rawPositionReport", this.rawPosition);
	}

	function buttonCallback(state) {
		io.emit("fireButton", state);
	}

	function attachListenersTo(joystick) {
		joystick.on("stickMove", moveCallback.bind(joystick));
		joystick.on("fireButton", buttonCallback);
	}

	function removeListenersOf(joystick) {
		joystick.removeListener("stickMove", moveCallback);
		joystick.removeListener("fireButton", buttonCallback);
	}
	
	app.get('/', function(req, res) {
		res.sendFile(__dirname +'/index.html');
	});

	app.use(express.static(path.join(__dirname, 'public')));

	var handlers = {
		connectJoystick: function() {
			console.log("Connecting joystick");
			attachListenersTo(joysticks[0]);
		},
		disconnectJoystick: function() {
			console.log("Disconnecting joystick");
			removeListenersOf(joysticks[0]);
		}
	};

	io.on('connection', function(socket){
		console.log('a user connected');
		socket.on('clientEvent', function(data) {
			if(data.action && handlers[data.action]) {
				handlers[data.action]();
			} else {
				console.log("No suitable handler found for action", data.action);
			}
		});
	});

	http.listen(1804, function(){
		console.log('listening on *:1804');
	});

	return app;
};

module.exports = monitorServer;