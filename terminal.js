const readline = require('readline')
const io = require('socket.io-client')
var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

rl.setPrompt('-> ');
let socket;


rl.question('Enter the server:port : ', server => {
	socket = io('http://localhost:3000');


//clear all
process.stdout.write('\033c');

let sessionMsg = new Array();

const addmsg = (msg, from) => {
	process.stdout.write('\033c');

	sessionMsg.push({ from, msg });

	sessionMsg.forEach(message => {

		if (message.from == 'local') {
			process.stdout.write(`\x1b[32m>> ${message.msg}\x1b[0m`);
		} else {
			process.stdout.write(`\x1b[36m<< ${message.msg}\x1b[0m`);
		}
		process.stdout.write('\n');
	});
}

socket.on('receive', (data) => {
	addmsg(data, 'remote');
	rl.prompt();
})

rl.prompt();

rl.on('line', function (message) {

	socket.emit('send', message);

	addmsg(message, 'local');

	rl.prompt()

});


})