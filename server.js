var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);


io.on('connection', function (socket) {

	console.log('New user connected, id ' + socket.id);
	//to confirm that conn was succeful
	io.to(`${socket.id}`).emit('connsucessful', true);

	socket.on('disconnect', function () {
		console.log('User disconnected');
	});

	socket.on('send', data => {
		socket.broadcast.emit('receive', data)
	}); 

	socket.on('toid', id => {
		console.log('aa');
		io.to(`${id}`).emit('receive', 'I just met you');
	})

});

http.listen(3000, function () {
	console.log('listening on *:3000');
});