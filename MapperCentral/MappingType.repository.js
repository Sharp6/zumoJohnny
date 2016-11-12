"use strict";

var functions = require('./functions');

var MappingTypeRepo = function() {
	this.mappingTypes = [
		{
			name: "Analog to Tank",
			stickMove: functions.stickMove,
			fireButton: functions.fireButton
		},
		{
			name: "Analog to Tank Exponential",
			stickMove: functions.expoStickMove,
			fireButton: functions.fireButton
		}
	];

	this.getMappingTypeNames = function() {
		return this.mappingTypes.map(function(mappingType) {
			return {
				name: mappingType.name
			};
		});
	};

	this.getAnalogToTankMapping = function() {
		return this.mappingTypes[0];
	};

	this.getMappingType = function(mappingTypeName) {
		return this.mappingTypes.find(function(mappingType) {
			return mappingType.name === mappingTypeName;
		});
	};

};

module.exports = MappingTypeRepo;