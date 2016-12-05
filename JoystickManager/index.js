"use strict";

var JoystickManager = function() {
  this.joysticks = [];

  this.addJoystick = function(joystick) {
    this.joysticks.push(joystick);
    this.emit("newJoystick", joystick);
  }
};

JoystickManager.prototype = Object.create(require('events').EventEmitter.prototype);
module.exports = JoystickManager;
