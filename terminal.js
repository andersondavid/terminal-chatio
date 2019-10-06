const readline = require('readline')
const io = require('socket.io-client')
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
let socket;
let user;
let sessionMsg = new Array();
rl.setPrompt('-> ')

//clear all
process.stdout.write('\033c');

const startConn = (fail) => {

	fail ? console.log(`\x1b[31mTry Again\x1b[0m`) : null

	rl.question('Enter the server: ', server => {
		socket = io(server);

		socket.on('connsucessful', bool => {
			//set user before enter chat
			console.log('\x1b[032mChat conected!\x1b[0m');

			rl.question('Set your username: ', user => {
				if (bool) startService(timeout, user);
			})
		})

		let timeout = setTimeout(() => {
			startConn(true)
		}, 5000);

	})
}; startConn();



const startService = (timeout, user) => {
	clearTimeout(timeout);
	process.stdout.write('\033c');

	const addmsg = (msgData, from) => {
		process.stdout.write('\033c');

		sessionMsg.push({ ...msgData, from });

		sessionMsg.forEach(message => {
			if (message.from == 'local') {
				process.stdout.write(`\x1b[33m${message.user} >> ${message.text}\x1b[0m`);
			} else {
				process.stdout.write(`\x1b[36m${message.user} << ${message.text}\x1b[0m`);
			}
			process.stdout.write('\n');
		});
	}

	socket.on('receive', (data) => {
		addmsg(data, 'remote');
		rl.prompt();
	})


	rl.on('line', function (text) {

		let msgData = { text, user: user };

		socket.emit('send', msgData);
		addmsg(msgData, 'local');
		rl.prompt()
	});

	rl.prompt();

}