var Player = function(data) {
	this.name = data.name;
	this.participants = ko.observableArray([]);
};