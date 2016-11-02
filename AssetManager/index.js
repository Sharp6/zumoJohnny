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
		message.split(":").forEach(function(keyValue) {
			msgObj[keyValue[0]] = keyValue[1];
		});

		if(msgObj.state) {
			this.state = msgObj.state;
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
		var data = parts.map(function(part) {
			var keyValue = part.split(":");
			var pair = {};
			pair[keyValue[0]] = keyValue[1];
			return pair;
		});
		var asset = new Asset(data);
		assets.push(asset);
		this.emit("newAsset", asset);
	}.bind(this));
};

AssetManager.prototype = Object.create(require('events').EventEmitter.prototype);

module.exports = AssetManager;