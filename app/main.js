const net = require('net');

const store = {};

const server = net.createServer((connection) => {
    console.log('Client connected');

    connection.on('data', (data) => {
        const commands = data.toString().trim().split('\r\n');

        const command = commands[2];

        if (command === 'ECHO') {
            const argument = commands[4];

            const response = `$${argument.length}\r\n${argument}\r\n`;
            connection.write(response);
        } else if (command === 'PING') {
            connection.write('+PONG\r\n');
        } else if (command === 'SET') {
            const key = commands[4];

            store[key] = commands[6];
            connection.write('+OK\r\n');
        } else if (command === 'GET') {
            const key = commands[4];
            const value = store[key];

            if (value !== undefined) {
                const response = `$${value.length}\r\n${value}\r\n`;
                connection.write(response);
            } else {
                connection.write('$-1\r\n');
            }
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
