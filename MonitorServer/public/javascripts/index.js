"use strict";
var socket = io();
var canvas;

var joysticks = ko.observableArray([]);
var robots = ko.observableArray([]);
var assets = ko.observableArray([]);
var players = ko.observableArray([]);
var participants = ko.observableArray([]);
var games = ko.observableArray([]);
var mappings = ko.observableArray([]);
var mappingTypes = ko.observableArray([]);

var newPlayer = {
	name: ko.observable()
};

var createPlayer = function() {
	console.log("CREATING PLAYER", { name: newPlayer.name() });
	socket.emit('clientEvent', { action: 'createPlayer', name: newPlayer.name() });
};

var newGame = {
	numberOfChallenges: ko.observable(),
	name: ko.observable()
};

var createGame = function() {
	console.log("CREATING GAME", { action:'createGame', assets: assets(), players: players(), numberOfChallenges: newGame.numberOfChallenges() });
	socket.emit('clientEvent', { action:'createGame', assets: assets(), players: players(), numberOfChallenges: newGame.numberOfChallenges(), name: newGame.name() });
};

var newMapping = {
	selectedJoystick: ko.observable(),
	selectedRobot: ko.observable(),
	selectedMappingType: ko.observable()
}

var requestMapping = function() {
	socket.emit('clientEvent', { action: 'requestMapping', joystick: newMapping.selectedJoystick().name, robot: newMapping.selectedRobot().name, mappingType: newMapping.selectedMappingType() });
};

socket.on("joysticks", function(data) {
	data.names.forEach(function(name) {
		joysticks.push(new Joystick(name));
	});
});

socket.on("robots", function(data) {
	data.names.forEach(function(name) {
		robots.push(new Robot(name));
	});
});

socket.on("assets", function(data) {
	data.assets.forEach(function(assetData) {
		assets.push(new Asset(assetData));
	});
});

socket.on("mappingTypes", function(data) {
	data.mappingTypes.forEach(function(mappingTypeData) {
		mappingTypes.push(mappingTypeData.name);
	});
});

socket.on("bindingNotification", function(data) {
	var currentJoystick = joysticks().find(function(joystick) {
		return joystick.name === data.joystickName;
	});
	var currentRobot = robots().find(function(robot) {
		return robot.name === data.robotName;
	});
	currentJoystick.mappedRobot(currentRobot);
});

// PLAYERS
socket.on("newPlayer", function(data) {
	console.log("FRONT got new player", data);
	players.push(new Player(data));
});

// PARTICIPANTS
socket.on("participantScoreUpdate", function(data) {
	var participantName = data.split("|")[0];
	//var playerName = data.split("|")[0];
	var score = data.split("|")[1];

	var participant = participants().find(function(participant) {
		return participant.name === participantName;
	});
	if(participant) {
		participant.score(score);	
	} else {
		console.log("Cannot find participant to update score:", participantName, "for participants", participants());
	}
});

// GAMES
socket.on("newGame", function(data) {
	console.log("FRONT got new game", data);
	games.push(new Game(data));
});

socket.on("gameStateChange", function(data) {
	var name = data.split("|")[0];
	var state = data.split("|")[1];

	var game = games().find(function(game) {
		return game.name === name;
	});
	game.state(state);
});

// CHALLENGES
socket.on("challengeStateChange", function(data) {
	var challengeName = data.split("|")[0];
	var challengeState = data.split("|")[1];
	// get game
	var gameName = challengeName.split("Challenge")[0]; // challengeName is gameName + "challenge" + i in game constructor
	var game = games().find(function(game) {
		return game.name === gameName;
	});
	// get challenge
	var challenge = game.challenges.find(function(challenge) {
		return challenge.name === challengeName;
	});
	// update challenge
	challenge.state(challengeState);
});

// ASSETS
socket.on("newAsset", function(data) {
	console.log("FRONT got new asset", data);
	assets.push(new Asset(data));
});

socket.on("assetStateUpdate", function(data) {
	var assetId = data.split("|")[0];
	var state = data.split("|")[1];

	var asset = assets().find(function(asset) {
		return asset.assetId === assetId;
	});
	asset.state(state);
});

socket.on("assetDisconnected", function(assetId) {
	var asset = assets().find(function(asset) {
		return asset.assetId === assetId;
	});
	if(asset) {
		assets.splice(assets.indexOf(asset), 1);	
	}
});

// MAPPINGS
socket.on("newMapping", function(data) {
	mappings.push(new Mapping(data));
});

socket.on("removedMapping", function(data) {
	var mapping = mappings().find(function(mapping) {
		return mapping.name === data.name;
	});
	if(mapping) {
		mappings.splice(mappings.indexOf(mapping), 1);
	}
});

socket.on("stickExtremesReport", function(msg) {
	$('#xMin').text(msg.x.min);
	$('#yMin').text(msg.y.min);
	$('#xMax').text(msg.x.max);
	$('#yMax').text(msg.y.max);
});

socket.on("rawPositionReport", function(msg) {
	$('#xPosRaw').text(msg.x);
	$('#yPosRaw').text(msg.y);
});

socket.on("normalizedPositionReport", function(msg) {
	$('#xPosNorm').text(msg.x);
	$('#yPosNorm').text(msg.y);
	drawCursor(msg);		  	
});

socket.on("fireButton", function(state) {
	$('#fireButton').text(state);
});

function drawCursor(data) {
	background(0, 0, 0);
	fill(0,255,10);
	noStroke();
	ellipse(
		map(data.x, -255, 255, -100, 100),
		map(data.y, -255, 255, 100, -100),
		10,
		10
	);
}

function setup() {
	canvas = createCanvas(200, 200);
	canvas.parent('sketchCell');
	background(255, 0, 200);

	translate(100,100);
}

function draw() { }

var vm = {
	joysticks: joysticks,
	robots: robots,
	assets: assets,
	mappingTypes: mappingTypes
};
ko.applyBindings(vm);