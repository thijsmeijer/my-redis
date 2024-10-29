const net = require('net');

const server = net.createServer((connection) => {
    console.log('Client connected');

    connection.on('data', (data) => {
        const commands = data.toString().trim().split('\r\n');

        const command = commands[2];
        let argument = '';

        if (command.length > 2) {
            argument = commands[4];
        }

        if (command === 'ECHO') {
            const response = `$${argument.length}\r\n${argument}\r\n`;
            connection.write(response);
        } else if (command === 'PING') {
            connection.write('+PONG\r\n');
        } else {
            connection.write('-ERR unknown command\r\n');
        }
    });

    connection.on('end', () => {
        console.log('Client disconnected');
    });

    connection.on('error', (err) => {
        console.error('Connection error:', err.message);
    });
});

server.listen(6379, '127.0.0.1', () => {
    console.log('Server listening on port 6379');
});
