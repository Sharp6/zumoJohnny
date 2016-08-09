var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var TestDriver = require('./TestDriver');
var AnalogJoystick = require('./../AnalogJoystick');
var joystick = new AnalogJoystick(new TestDriver());

app.get('/', function(req, res){
  res.sendFile(__dirname +'/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
});

joystick.on("stickMove", function() {
  io.emit("stickExtremesReport", joystick.extremes);
  io.emit("normalizedPositionReport", joystick.normalizedPosition);
  io.emit("rawPositionReport", joystick.rawPosition);
});

joystick.on("fireButton", function(state) {
  io.emit("fireButton", state);
});

http.listen(1804, function(){
  console.log('listening on *:1804');
});