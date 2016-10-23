var monitorServer = function(joystick) {
	var express = require('express');
	var path = require('path');
	var app = express();
	var http = require('http').Server(app);
	var io = require('socket.io')(http);

	console.log("joystick wants to be used.");
	joystick.on("stickMove", function() {
		io.emit("stickExtremesReport", joystick.extremes);
		io.emit("normalizedPositionReport", joystick.normalizedPosition);
		io.emit("rawPositionReport", joystick.rawPosition);
	});

	joystick.on("fireButton", function(state) {
		io.emit("fireButton", state);
	});
	
	app.get('/', function(req, res) {
		res.sendFile(__dirname +'/index.html');
	});

	app.use(express.static(path.join(__dirname, 'public')));

	io.on('connection', function(socket){
		console.log('a user connected');
	});

	http.listen(1804, function(){
		console.log('listening on *:1804');
	});

	return app;
};

module.exports = monitorServer;