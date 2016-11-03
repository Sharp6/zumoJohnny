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

module.exports = Asset;