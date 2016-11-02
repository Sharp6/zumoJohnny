"use strict";

function Asset(data) {
	var mqtt = require('mqtt');
	var assetClient = mqtt.connect('mqtt://192.168.1.124');
	assetClient.on('connect', function() {
		assetClient.subscribe(this.inTopic);
	}.bind(this));

	this.assetId = data.assetId;
	this.type = data.type;
	this.state = "";

	this.inTopic = "oBots/assets/" + data.assetId + "/fromAsset";
	this.outTopic = "oBots/assets/" + data.assetId + "/fromServer";

	assetClient.on('message', function(topic, message) {
		console.log("Got assetMessage", message.toString(), "on topic", topic);
		var msgObj = {};
		msgObj[message.toString().split(":")[0]] = message.toString().split(":")[1];
		console.log("msgObj", msgObj);

		if(msgObj.state) {
			this.state = msgObj.state;
			console.log("AssetManager emitting", this.state);
			this.emit("assetStateUpdate", this.state);
		}
	}.bind(this));
}
Asset.prototype = Object.create(require('events').EventEmitter.prototype);

var AssetManager = function() {
	var mqtt = require('mqtt');
	// This should be configed externally.
	var client = mqtt.connect('mqtt://192.168.1.124');

	var assets = [];

	client.on('connect', function () {
		client.subscribe('oBots/assets');
	});

	client.on('message', function (topic, message) {
		var parts = message.toString().split("|");
		var data = parts.reduce(function(data, part) {
			var keyValue = part.split(":");
			data[keyValue[0]] = keyValue[1];
			return data;
		}, {});
		console.log("ASSETMANAGER formatted data",data);

		if(data.type && data.assetId) {
			var newAsset = new Asset(data);
			assets.push(newAsset);
			this.emit("newAsset", newAsset);
		}

		if(data.assetId && data.update && data.update == "disconnected") {
			var discAsset = assets.find(function(asset) {
				return asset.assetId == data.assetId;
			});

			discAsset.emit("assetDisconnected", "sadly");
			assets.splice(assets.indexOf(discAsset), 1);
		}
		
	}.bind(this));
};

AssetManager.prototype = Object.create(require('events').EventEmitter.prototype);

module.exports = AssetManager;