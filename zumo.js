var fs = require('fs');

var five = require("johnny-five");

var MonitorServer = require('./MonitorServer');
var ZumoBot = require("./zumoBot");
//var AtariJoystick = require("./AtariJoystick");
//var Ps3Joystick = require("./ps3Joystick");
var NunchukJoystick = require('./NunchukJoystick');
var AnalogJoystick = require("./AnalogJoystick");

var config = JSON.parse(fs.readFileSync('./zumoConfig.json').toString());

var robot;
var joysticks = [];

var monitor;

initBoards()
  //.then(performMapping)
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
        console.log("Robot is ready");
      } else if (boardType === "nunchuk") {
        joysticks.push(new AnalogJoystick(board.id, new NunchukJoystick(board, five)));
        console.log("Joystick has been initted.");
      }
    }

    new five.Boards(config.ports).on("ready", function() {
      console.log("Boards are ready");
      this.each(assignBoard);
      resolve();
    });
  });
}

function performMapping(){
  return new Promise(function(resolve,reject) {
    if(robot && joystick) {
      mapAnalogToZumo(robot, joystick);
      robot.buzz();
      resolve();
    } else {
      reject("Robot and joystick not ready");
    }
  });
}

function initMonitor() {
  return new Promise(function(resolve,reject) {
    monitor = new MonitorServer(joysticks);
    resolve();
  });
}

function mapAnalogToZumo(zumo, analogJoystick) {
  console.log("Doing the mapping!");
  
  analogJoystick.on("stickMove", function() {
    console.log("ZUMOMAPPER: Got a stickmove!");
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

    console.log("Calling the robot with", leftMotorSpeed, rightMotorSpeed);
    zumo.leftDirect(leftMotorSpeed);
    zumo.rightDirect(rightMotorSpeed);
  });

  analogJoystick.on("fireButton", function(state) {
    if(state === "on") {
      zumo.fire();
    } else {
      zumo.holdFire();
    }
  });
}