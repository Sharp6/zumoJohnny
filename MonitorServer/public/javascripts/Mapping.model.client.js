var Mapping = function(data) {
	this.name = data.name;

	this.requestMapRemoval = function() {
		socket.emit('clientEvent', { action: 'requestMapRemoval', name: this.name });
	};
};