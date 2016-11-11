var Asset = function(data) {
	this.type = data.type;
	this.assetId = data.assetId;
	this.state = ko.observable("Unknown state");
};
