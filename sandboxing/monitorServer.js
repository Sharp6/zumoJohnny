var monitorServer = function(joystick) {
	var express = require('express');
	var app = express();
	var http = require('http').Server(app);
	var io = require('socket.io')(http);
	var path = require('path');

	joystick.on("stickMove", function() {
		io.emit("stickExtremesReport", joystick.extremes);
		io.emit("normalizedPositionReport", joystick.normalizedPosition);
		io.emit("rawPositionReport", joystick.rawPosition);
	});

	joystick.on("fireButton", function(state) {
		io.emit("fireButton", state);
	});

	app.use(express.static(path.join(__dirname, 'public')));
	
	app.get('/', function(req, res) {
		res.sendFile(__dirname +'/index.html');
	});

	io.on('connection', function(socket){
		console.log('a user connected');
	});

	http.listen(1804, function(){
		console.log('listening on *:1804');
	});
};

module.exports = monitorServer;