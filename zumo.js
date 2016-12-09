"use strict";
var fs = require('fs');

var Firmata = require("firmata");
var EtherPortClient = require("etherport-client").EtherPortClient;
var five = require("johnny-five");

var MonitorServer = require('./MonitorServer');

var MapperRepo = require('./Mapping/MappingRepository');
var JoystickRepo = require('./Joystick/JoystickRepository');
var RobotRepo = require('./Robot/RobotRepository');
var AssetRepo = require('./Asset/AssetRepository');
var GameRepo = require('./Game/GameRepository');
var PlayerRepo = require('./Player/PlayerRepository');

var TankBot = require("./TankBot");
var ZumoJohnnyEsp = require("./ZumoJohnnyEsp");
var ZumoJohnnyDirect = require("./ZumoJohnnyDirect");

//var AtariJoystick = require("./AtariJoystick");
//var Ps3Joystick = require("./ps3Joystick");
var NunchukJoystick = require('./NunchukJoystick');
var AnalogJoystick = require("./AnalogJoystick");

var config = {};
config.json = JSON.parse(fs.readFileSync('./zumoConfig.json').toString());
config.ports = config.json.ports.map(function(configEntry) {
  if(configEntry.host) {
    // Do the ethernet
    configEntry.io = new Firmata(new EtherPortClient({
      host: configEntry.host,
      port: 3030
    }));
    configEntry.timeout = 1e5;
    return configEntry;
  } else {
    return configEntry;
  }
});

var joystickRepo, robotRepo, mappingRepo, assetRepo, playerRepo, gameRepo;
var monitor;

initRobotManager()
  .then(initJoystickManager)
  .then(initBoards)
  .then(initAssetManager)
  .then(initPlayerManager)
  .then(initGameManager)
  .then(initMapper)
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
        //robot = new ZumoBot(board, five);
        //robots.push(new ZumoBot(board.id, board, five));
        robotManager.addRobot(new TankBot(new ZumoJohnnyDirect(board.id, board, five)));
        console.log("Robot is ready");
      } else if (boardType === "zumoEsp") {
        robotManager.addRobot(new TankBot(new ZumoJohnnyEsp(board.id, board, five)));
        console.log("ESP ZUMO BOT is ready");
      } else if (boardType === "nunchuk") {
        joystickManager.addJoystick(new AnalogJoystick(board.id, new NunchukJoystick(board, five)));
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

function initJoystickManager(){
  return new Promise(function(resolve,reject) {
    joystickManager = new JoystickManager();
    resolve();
  });
}

function initRobotManager(){
  return new Promise(function(resolve,reject) {
    robotManager = new RobotManager();
    resolve();
  });
}

function initMonitor() {
  return new Promise(function(resolve,reject) {
    monitor = new MonitorServer({ robotManager: robotManager, joystickManager: joystickManager, assetManager: assetManager, gameManager: gameManager, playerManager: playerManager, mapperRepository: mapperRepo });
    resolve();
  });
}

function initMapper() {
  return new Promise(function(resolve,reject) {
    mapperRepo = new MapperCentral(joystickManager, robotManager);
    resolve();
  });
}

function initAssetManager() {
  return new Promise(function(resolve,reject) {
    assetManager = new AssetManager();
    resolve();
  });
}

function initGameManager() {
  return new Promise(function(resolve,reject) {
    gameManager = new GameManager();
    resolve();
  });
}

function initPlayerManager() {
  return new Promise(function(resolve,reject) {
    playerManager = new PlayerManager();
    resolve();
  });
}
