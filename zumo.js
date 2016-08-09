var five = require("johnny-five");

var ZumoDriver = require("./zumoDriver");
var AtariJoystick = require("./AtariJoystick");
var Ps3Joystick = require("./ps3Joystick");
var NunchukJoystick = require('./nunchukJoystick');

// CONFIG PART
var ports = [
  { id: "zumoBoard", port: "" },
  { id: "nunchukBoard", port: "" }
];

var zumo;
var nunchukJoystick;

new five.Boards(ports).on("ready", function() {
  console.log("Boards are ready");

  this.each(function(board) {
    if(board.id === "zumoBoard") {
      zumo = new ZumoBot(board, five);
    } else if (board.id === "nunchukBoard") {
      nunchukJoystick = new NunchukJoystick(board, robot, five);
    }
  });

  zumo.buzz();
});