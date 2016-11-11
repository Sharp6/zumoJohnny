"use strict";

var Mapping = require("./Mapping");
var MappingType = require('./MappingType');
var mappingTypes = new MappingType();

var MapperCentral = function(joysticks, robots) {

	var mappings = [];

	this.requestMapping = function(data) {
		console.log("MapperCentral got a request for mapping", data);
		var robot = robots.find(function(robot) {
			return robot.name === data.robotName;
		});
		var joystick = joysticks.find(function(joystick) {
			return joystick.name === data.joystickName;
		});

		var mapping = mappings.find(function(mapping) {
			return mapping.joystickName === data.joystickName;
		});

		if(mapping) {
			// Mapping for this joystick already exists. What should happen now?
		} else {
			var mappingType = mappingTypes.getAnalogToTankMapping();
			var newMapping = new Mapping(robot,joystick,mappingType);
			newMapping.attachListeners();
			if(newMapping) {
				mappings.push(newMapping);
				joystick.notifyBinding(data.robotName);
			}
		}
	};


	this.requestMapRemoval = function(data) {
		var mapping = mappings.find(function(mapping) {
			return mapping.joystickName === data.joystickName;
		});

		if(mapping) {
			mapping.removeListeners();
			mappings.splice(mappings.indexOf(mapping),1);
			mapping.joystick.notifyBinding(null);
		} else {
			// Mapping not found. What should happen now?
		}
	};
};

module.exports = MapperCentral;