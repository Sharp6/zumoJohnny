"use strict";

var Asset = require('./Asset');

var AssetManager = function() {
	var mqtt = require('mqtt');
	// This should be configed externally.
	var client = mqtt.connect('mqtt://192.168.1.124');

	var assets = [];

	this.getAssetFor = function(assetId) {
		return this.assets.find(function(asset) {
			return asset.assetId == assetId;
		});
	};

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