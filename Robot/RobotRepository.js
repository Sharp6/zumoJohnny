"use strict";

var RobotRepository = function() {
  this.robots = [];

  this.addRobot = function(robot) {
    this.robots.push(robot);
    this.emit("newRobot", robot);
  };
};

RobotRepository.prototype = Object.create(require('events').EventEmitter.prototype);
module.exports = RobotRepository;
