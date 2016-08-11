var fs = require('fs');

var five = require("johnny-five");

var MonitorServer = require('./MonitorServer');
var ZumoDriver = require("./zumoDriver");
//var AtariJoystick = require("./AtariJoystick");
//var Ps3Joystick = require("./ps3Joystick");
var NunchukJoystick = require('./NunchukJoystick');
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
        robot = new ZumoBot(board, five);
      } else if (boardType === "nunchuk") {
        joystick = new AnalogJoystick(new NunchukJoystick(board, five));
        console.log("Joystick has been initted.");
      }
    }

    new five.Boards(config.ports).on("ready", function() {
      console.log("Boards are ready");
      this.each(assignBoard);
      if(robot && joystick) {
        mapAnalogToZumo(robot, joystick);
        robot.buzz();
      }
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

function mapAnalogToZumo(zumo, analogJoystick) {
  joystick.on("stickMove", function() {
    var leftMotorSpeed, rightMotorSpeed;

    leftMotorSpeed = rightMotorSpeed = analogJoystick.normalizedPosition.y;
    leftMotorSpeed += analogJoystick.normalizedPosition.x;
    rightMotorSpeed -= analogJoystick.normalizedPosition.x;

    // This should never happen
    if (leftMotorSpeed > 255) {
      leftMotorSpeed = 255;
    } else if (leftMotorSpeed < -255) {
      leftMotorSpeed = -255;
    }

    // This should never happen
    if (rightMotorSpeed > 255) {
      rightMotorSpeed = 255;
    } else if (rightMotorSpeed < -255) {
      rightMotorSpeed = -255;
    }

    zumo.leftDirect(leftMotorSpeed);
    zumo.rightDirect(rightMotorSpeed);
  });

  joystick.on("fireButton", function(state) {
    if(state === "on") {
      zumo.fire();
    } else {
      zumo.holdFire();
    }

  });
}
