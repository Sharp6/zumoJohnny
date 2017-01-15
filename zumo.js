"use strict";
var fs = require('fs');

var Firmata = require("firmata");
var EtherPortClient = require("etherport-client").EtherPortClient;
var five = require("johnny-five");

var MonitorServer = require('./MonitorServer');

var MappingRepo = require('./Mapping/MappingRepository');
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
var WiiJoystick = require('./WiiJoystick');
var AnalogJoystick = require("./AnalogJoystick");
var DigitalJoystick = require("./DigitalJoystick");

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

initRobotRepo()
  .then(initJoystickRepo)
  .then(initBoards)
  .then(initIpcs)
  .then(initAssetRepo)
  .then(initPlayerRepo)
  .then(initGameRepo)
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
        robotRepo.addRobot(new TankBot(new ZumoJohnnyDirect(board.id, board, five)));
        console.log("Robot is ready");
      } else if (boardType === "zumoEsp") {
        robotRepo.addRobot(new TankBot(new ZumoJohnnyEsp(board.id, board, five)));
        console.log("ESP ZUMO BOT is ready");
      } else if (boardType === "nunchuk") {
        joystickRepo.addJoystick(new AnalogJoystick(board.id, new NunchukJoystick(board, five)));
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

function initIpcs() {
  return new Promise(function(resolve,reject) {
    joystickRepo.addJoystick(new DigitalJoystick("WiiMote", new WiiJoystick()));
    resolve();
  });
}

function initJoystickRepo(){
  return new Promise(function(resolve,reject) {
    joystickRepo = new JoystickRepo();
    resolve();
  });
}

function initRobotRepo(){
  return new Promise(function(resolve,reject) {
    robotRepo = new RobotRepo();
    resolve();
  });
}

function initMonitor() {
  return new Promise(function(resolve,reject) {
    monitor = new MonitorServer({ robotRepo: robotRepo, joystickRepo: joystickRepo, assetRepo: assetRepo, gameRepo: gameRepo, playerRepo: playerRepo, mappingRepo: mappingRepo });
    resolve();
  });
}

function initMapper() {
  return new Promise(function(resolve,reject) {
    mappingRepo = new MappingRepo(joystickRepo, robotRepo);
    resolve();
  });
}

function initAssetRepo() {
  return new Promise(function(resolve,reject) {
    assetRepo = new AssetRepo();
    resolve();
  });
}

function initGameRepo() {
  return new Promise(function(resolve,reject) {
    gameRepo = new GameRepo();
    resolve();
  });
}

function initPlayerRepo() {
  return new Promise(function(resolve,reject) {
    playerRepo = new PlayerRepo();
    resolve();
  });
}
