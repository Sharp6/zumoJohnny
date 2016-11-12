var Mapping = function(data) {
	this.name = data.name;

	this.requestMapRemoval = function() {
		console.log("Requesting Mapping removal for", this.name);
		socket.emit('clientEvent', { action: 'requestMapRemoval', name: this.name });
	};
};