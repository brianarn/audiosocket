// AudioSocket
/* jshint node:true */

'use strict';

// Create our Express application
var http = require('http');
var express = require('express');
var app = express();

// Set up some basic config
app.set('port', process.env.PORT || 3000);

// Middleware setup
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.compress());
app.use(express.methodOverride());
//app.use(express.cookieParser('omgsecretz'));
//app.use(express.session());
//app.use(app.router);
app.use(express.static(__dirname + '/public'));

// Development only
if (app.get('env') === 'development') {
	app.use(express.errorHandler());
}

//app.get('/', routes.index);
//app.get('/users', user.list);

// Create the server instance
var server = http.createServer(app);

// Start the server up
server.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

// Get socket.io going
var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket){
	// Simply broadcast start/stop everywhere
	socket.on('start', function(object){
		socket.broadcast.emit('start', object);
		socket.emit('start', object);
	});
	socket.on('stop', function(object){
		socket.broadcast.emit('stop', object);
		socket.emit('stop', object);
	});
	// Send frequency changes
});
