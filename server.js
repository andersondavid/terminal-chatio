var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);


io.on('connection', function (socket) {

	console.log('New user connected, id ' + socket.id);

	io.to(`${socket.id}`).emit('conn', 'I just met you');

	socket.on('disconnect', function () {
		console.log('User disconnected');
	});

	socket.on('send', data => {
		socket.broadcast.emit('receive', data)
	});

});

http.listen(3000, function () {
	console.log('listening on *:3000');
});