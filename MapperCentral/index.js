"use strict";

var Mapping = require("./Mapping");
var MappingType = require('./MappingType.repository');

var MapperCentral = function(joystickManager, robotManager) {

	var mappings = [];
	var mappingTypes = new MappingType();

	this.mappingTypeNames = mappingTypes.getMappingTypeNames();

	this.requestMapping = function(data) {
		console.log("MapperCentral got a request for mapping", data);
		var robot = robotManager.robots.find(function(robot) {
			return robot.name === data.robotName;
		});
		var joystick = joystickManager.joysticks.find(function(joystick) {
			return joystick.name === data.joystickName;
		});
		var mappingType = mappingTypes.getMappingType(data.mappingType); // Select the mapping type

		var mapping = mappings.find(function(mapping) {
			return mapping.joystickName === data.joystickName;
		});

		if(mapping) {
			// Mapping for this joystick already exists. What should happen now?
		} else {

			var newMapping = new Mapping(robot,joystick,mappingType);
			newMapping.attachListeners();
			if(newMapping) {
				mappings.push(newMapping);
				//joystick.notifyBinding(data.robotName);
				this.emit("newMapping", newMapping);
			}
		}
	};

	this.requestMapRemoval = function(data) {
		var mapping = mappings.find(function(mapping) {
			return mapping.name === data.name;
		});

		if(mapping) {
			mapping.removeListeners();
			mappings.splice(mappings.indexOf(mapping),1);
			this.emit("removedMapping", { name: mapping.name });
		} else {
			// Mapping not found. What should happen now?
		}
	};
};

MapperCentral.prototype = Object.create(require('events').EventEmitter.prototype);

module.exports = MapperCentral;
