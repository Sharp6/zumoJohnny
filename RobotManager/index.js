"use strict";

var RobotManager = function() {
  this.robots = [];

  this.addRobot = function(robot) {
    this.robots.push(robot);
    this.emit("newRobot", robot);
  }
};

RobotManager.prototype = Object.create(require('events').EventEmitter.prototype);
module.exports = RobotManager;
