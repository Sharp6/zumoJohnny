var ipc = require('node-ipc');

function startServer(callback) {
	ipc.config.id = 'zumobot';
	ipc.config.retry = 1500;
	ipc.config.rawBuffer = true;

	ipc.serve(
	    function(){
	        ipc.server.on(
	            'data', callback
	        );
	        console.log("Socket server is listening.");
	    }
	);
	ipc.server.start();	
}

module.exports = startServer;