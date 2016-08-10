var fs = require('fs');

var five = require("johnny-five");

var MonitorServer = require('./MonitorServer');
var ZumoDriver = require("./zumoDriver");
var AtariJoystick = require("./AtariJoystick");
var Ps3Joystick = require("./ps3Joystick");
var NunchukJoystick = require('./nunchukJoystick');
var AnalogJoystick = require("./AnalogJoystick");

var config = JSON.parse(fs.readFileSync('./zumoConfig.json').toString());

var robot;
var joystick;

var monitor;

initBoards()
  .then(initMonitor)
  .then(function() {
    console.log("Init all done!");
  })
  .catch(function(err) {
    console.log("Sadly, an error has occurred", err);
  });

function initBoards() {
  return new Promise(function(resolve,reject) {
    function assignBoard(board) {
      var boardType = board.id.substr(0, board.id.indexOf("Board"));
      console.log("Got boardType", boardType);

      if(boardType === "zumo") {
        zumo = new ZumoBot(board, five);
      } else if (boardType === "nunchuk") {
        joystick = new AnalogJoystick(new NunchukJoystick(board, five));
      }
    }

    new five.Boards(config.ports).on("ready", function() {
      console.log("Boards are ready");
      this.each(assignBoard);
      robot.buzz();
      resolve();
    });
  });
}

function initMonitor() {
  return new Promise(function(resolve,reject) {
    monitor = new MonitorServer();
    resolve();
  });
}
